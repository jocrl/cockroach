// Copyright 2022 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

package persistedsqlstats_test

import (
	"context"
	"fmt"
	"github.com/cockroachdb/cockroach/pkg/sql/sqlstats"
	"strings"
	"testing"
	"time"

	"github.com/cockroachdb/cockroach/pkg/base"
	"github.com/cockroachdb/cockroach/pkg/sql"
	"github.com/cockroachdb/cockroach/pkg/sql/catalog/systemschema"
	"github.com/cockroachdb/cockroach/pkg/sql/sqlstats/persistedsqlstats"
	"github.com/cockroachdb/cockroach/pkg/testutils/serverutils"
	"github.com/cockroachdb/cockroach/pkg/testutils/sqlutils"
	"github.com/cockroachdb/cockroach/pkg/util/leaktest"
	"github.com/cockroachdb/cockroach/pkg/util/log"
	"github.com/cockroachdb/cockroach/pkg/util/timeutil"
	"github.com/stretchr/testify/require"
)

type earliestAggTsTestCase struct {
	tableName  string
	runWithTxn bool
}

var earliestAggTsTestCases = []earliestAggTsTestCase{
	{
		tableName:  "system.statement_statistics",
		runWithTxn: false,
	},
	{
		tableName:  "system.transaction_statistics",
		runWithTxn: true,
	},
}

func TestScanEarliestAggregatedTs(t *testing.T) {
	defer leaktest.AfterTest(t)()
	defer log.Scope(t).Close(t)

	for _, tc := range earliestAggTsTestCases {

		tableName := tc.tableName
		runWithTxn := tc.runWithTxn

		baseTime := timeutil.Now()
		aggInterval := time.Hour

		// chosen to ensure a different truncated aggTs
		advancementInterval := time.Hour * 2

		fakeTime := stubTime{
			aggInterval: aggInterval,
		}
		fakeTime.setTime(baseTime)

		s, db, _ := serverutils.StartServer(t, base.TestServerArgs{
			Knobs: base.TestingKnobs{
				SQLStatsKnobs: &sqlstats.TestingKnobs{
					StubTimeNow: fakeTime.Now,
				},
			},
		})

		ctx := context.Background()
		defer s.Stopper().Stop(ctx)

		sqlStats := s.SQLServer().(*sql.Server).GetSQLStatsProvider().(*persistedsqlstats.PersistedSQLStats)
		sqlConn := sqlutils.MakeSQLRunner(db)

		truncatedBaseTime := baseTime.Truncate(aggInterval)

		t.Run(fmt.Sprintf("%s empty table", tc.tableName), func(t *testing.T) {
			// generate un-flushed stats distributed across shards (there should also be un-flushed stats from internal queries)
			runStatements(t, sqlConn, systemschema.SQLStatsHashShardBucketCount*2, runWithTxn)

			// verify test set up, that the table is indeed empty
			stmt := fmt.Sprintf(`SELECT count(*) FROM %[1]s`,
				tableName,
			)
			row := sqlConn.QueryRow(t, stmt)
			var count int
			row.Scan(&count)
			require.Equal(t, count, 0)

			emptyTableEarliestAggTs, err := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), tableName)
			if err != nil {
				t.Fatal(err)
			}
			require.Equal(t, truncatedBaseTime, emptyTableEarliestAggTs, "expected: %s, got: %s", truncatedBaseTime, emptyTableEarliestAggTs)
		})

		t.Run(fmt.Sprintf("%s populated table", tc.tableName), func(t *testing.T) {
			// flush the stats at baseTime
			sqlStats.Flush(ctx)

			// generate stats at an earlier time, before baseTime
			beforeBaseTime := baseTime.Add(-advancementInterval)
			fakeTime.setTime(beforeBaseTime)
			truncatedBeforeBaseTime := beforeBaseTime.Truncate(aggInterval)
			// run one single earliest statement/transaction
			runStatements(t, sqlConn, 1, runWithTxn)
			sqlStats.Flush(ctx)

			// run and flush statements at a later time
			afterBaseTime := baseTime.Add(advancementInterval)
			fakeTime.setTime(afterBaseTime)
			runStatements(t, sqlConn, systemschema.SQLStatsHashShardBucketCount*2, runWithTxn)
			sqlStats.Flush(ctx)

			// verify test set up
			verifyDistinctAggregatedTs(t, sqlConn, tableName, []time.Time{truncatedBeforeBaseTime, truncatedBaseTime, afterBaseTime.Truncate(aggInterval)})
			verifyNotPresentInAllShards(t, sqlConn, tableName, truncatedBeforeBaseTime)

			diskEarliestAggTs2, err2 := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), tableName)
			if err2 != nil {
				t.Fatal(err2)
			}
			require.Equal(t, truncatedBeforeBaseTime, diskEarliestAggTs2, "expected: %s, got: %s", truncatedBeforeBaseTime, diskEarliestAggTs2)
		})
	}

}

func runStatements(
	t *testing.T,
	sqlConn *sqlutils.SQLRunner,
	numStatements int,
	withTxn bool,
) {
	for i := 1; i < numStatements+1; i++ {
		// generate statements with unique fingerprints, so that they get distributed across all shards
		ones := make([]string, i)
		for j := 0; j < len(ones); j++ {
			ones[j] = "1"
		}
		stmt := fmt.Sprintf("SELECT %[1]s", strings.Join(ones, ", "))
		if withTxn {
			stmt = fmt.Sprintf("BEGIN; %[1]s; COMMIT;", stmt)
		}
		sqlConn.Exec(t, stmt)
	}
}

func verifyDistinctAggregatedTs(
	t *testing.T,
	sqlConn *sqlutils.SQLRunner,
	tableName string,
	sortedExpectedAggregatedTsValues []time.Time,
) {
	// [1]: table name
	// [2]: hash column name
	stmt := fmt.Sprintf(`SELECT DISTINCT aggregated_ts FROM %[1]s ORDER BY aggregated_ts`,
		tableName,
	)
	rows := sqlConn.Query(t, stmt)
	defer rows.Close()
	aggregatedTsValues := []time.Time{}

	for rows.Next() {
		var aggregatedTs time.Time
		if err := rows.Scan(&aggregatedTs); err != nil {
			t.Fatal(err)
		}
		aggregatedTsValues = append(aggregatedTsValues, aggregatedTs)

	}

	require.Equal(t, sortedExpectedAggregatedTsValues, aggregatedTsValues)

}

func verifyNotPresentInAllShards(
	t *testing.T,
	sqlConn *sqlutils.SQLRunner,
	tableName string, aggTs time.Time) {
	// this is a more convenient, though stricted test. if there are fewer stats with that aggTs than shards, then definitely not all shards have a row with that aggTs
	// using this
	// concretely, running a single query/transaction generates two statement statistics (one for itself, and one for inserting the statistic), and one transaction statistic (if it's a transaction)
	stmt := fmt.Sprintf(`SELECT count(*) FROM %[1]s WHERE aggregated_ts = $1::TIMESTAMP`,
		tableName,
	)
	row := sqlConn.QueryRow(t, stmt, aggTs)
	var count int
	row.Scan(&count)
	require.Less(t, count, systemschema.SQLStatsHashShardBucketCount)
}
