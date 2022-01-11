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
	"testing"
	"time"

	"github.com/cockroachdb/cockroach/pkg/sql"
	"github.com/cockroachdb/cockroach/pkg/sql/catalog/systemschema"
	"github.com/cockroachdb/cockroach/pkg/sql/sqlstats/persistedsqlstats"
	"github.com/cockroachdb/cockroach/pkg/sql/tests"
	"github.com/cockroachdb/cockroach/pkg/testutils/serverutils"
	"github.com/cockroachdb/cockroach/pkg/testutils/sqlutils"
	"github.com/cockroachdb/cockroach/pkg/util/leaktest"
	"github.com/cockroachdb/cockroach/pkg/util/log"
	"github.com/cockroachdb/cockroach/pkg/util/timeutil"
	"github.com/stretchr/testify/require"
)

func TestScanEarliestAggregatedTs(t *testing.T) {
	defer leaktest.AfterTest(t)()
	defer log.Scope(t).Close(t)

	baseTime := timeutil.Now()
	//.Add(5 * time.Second)
	aggInterval := time.Hour

	// chosen to ensure a different truncated aggTs
	advancementInterval := time.Hour * 2

	fakeTime := stubTime{
		aggInterval: aggInterval,
	}
	fakeTime.setTime(baseTime)

	params, _ := tests.CreateTestServerParams()
	s, db, _ := serverutils.StartServer(t, params)

	ctx := context.Background()
	defer s.Stopper().Stop(ctx)

	sqlStats := s.SQLServer().(*sql.Server).GetSQLStatsProvider().(*persistedsqlstats.PersistedSQLStats)
	sqlConn := sqlutils.MakeSQLRunner(db)
	// set up multiple persisted times, also in-memory

	for _, tc := range testQueries {
		for i := int64(0); i < tc.count; i++ {
			sqlConn.Exec(t, tc.query)
		}
	}

	//expectedStmtFingerprints := make(map[string]int64)
	//for _, tc := range testQueries {
	//	expectedStmtFingerprints[tc.fingerprint] = tc.count
	//	for i := int64(0); i < tc.count; i++ {
	//		sqlConn.Exec(t, tc.query)
	//	}
	//}

	// fixme how does it end up on diff shards? guarantee that we check all
	// fixme generate different times

	truncatedBaseTime := baseTime.Truncate(aggInterval)
	t.Run("in-memory read", func(t *testing.T) {
		memoryEarliestAggTs, err := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
		fmt.Println("mem", memoryEarliestAggTs)
		if err != nil {
			t.Fatal(err)
		}
		require.Equal(t, truncatedBaseTime, memoryEarliestAggTs, "expected: %s, got: %s", truncatedBaseTime, memoryEarliestAggTs)

	})

	t.Run("disk read", func(t *testing.T) {
		sqlStats.Flush(ctx)

		// normal disk read
		//diskEarliestAggTs1, err1 := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
		//if err1 != nil {
		//	t.Fatal(err1)
		//}
		//require.Equal(t, truncatedBaseTime, diskEarliestAggTs1, "expected: %s, got: %s", truncatedBaseTime, diskEarliestAggTs1)

		// run and flush statements at an earlier time, before baseTime
		beforeBaseTime := baseTime.Add(-advancementInterval)
		fmt.Println("before time", beforeBaseTime)
		truncatedBeforeBaseTime := beforeBaseTime.Truncate(aggInterval)
		fakeTime.setTime(beforeBaseTime)
		for _, tc := range testQueries {
			for i := int64(0); i < tc.count; i++ {
				sqlConn.Exec(t, tc.query)
			}
		}

		sqlStats.Flush(ctx)

		afterBaseTime := baseTime.Add(advancementInterval)
		fakeTime.setTime(afterBaseTime)
		// run and flush statements at a later time
		for _, tc := range testQueries {
			for i := int64(0); i < tc.count; i++ {
				sqlConn.Exec(t, tc.query)
			}
		}
		sqlStats.Flush(ctx)

		//// we need to set time to aftwards again before doing the read, because of the AOST clause
		//fakeTime.setTime(afterBaseTime)

		// the earliest aggTs should now be beforeBaseTime
		diskEarliestAggTs2, err2 := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
		if err2 != nil {
			t.Fatal(err2)
		}
		require.Equal(t, truncatedBeforeBaseTime, diskEarliestAggTs2, "expected: %s, got: %s", truncatedBeforeBaseTime, diskEarliestAggTs2)

		//for _, tc := range testQueries {
		//	verifyAggregatedTsOfInsertedEntries(t, sqlConn, tc.fingerprint, "system.statement_statistics")
		//}

		//fakeTime.setTime(fakeTime.Now().Add(aggInterval * 3))
		//for _, tc := range testQueries {
		//	for i := int64(0); i < tc.count; i++ {
		//		sqlConn.Exec(t, tc.query)
		//	}
		//}
		//for _, tc := range testQueries {
		//	expectedStmtFingerprints[tc.fingerprint] = tc.count
		//	for i := int64(0); i < tc.count; i++ {
		//		sqlConn.Exec(t, tc.query)
		//	}
		//}
		//sqlStats.Flush(ctx)
		//fmt.Println("flush 2", fakeTime.Now())
		//
		//for _, tc := range testQueries {
		//	verifyAggregatedTsOfInsertedEntries(t, sqlConn, tc.fingerprint, "system.statement_statistics")
		//}
		//
		//earliestAggregatedTs2, err2 := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
		//fmt.Println("disk2", earliestAggregatedTs2)
		//if err2 != nil {
		//	t.Fatal(err2)
		//}
	})

	//t.Run("hybrid read", func(t *testing.T) {
	//	// We execute each test queries one more time without flushing the stats.
	//	// This means that we should see the exact same result as previous subtest
	//	// except the execution count field will be incremented. We should not
	//	// be seeing duplicated fields.
	//	for _, tc := range testQueries {
	//		sqlConn.Exec(t, tc.query)
	//		tc.count++
	//		earliestAggregatedTs, err := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
	//		fmt.Println("both", earliestAggregatedTs)
	//		if err != nil {
	//			t.Fatal(err)
	//		}
	//	}
	//})
	//earliestAggregatedTs, err := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)

	//if err != nil {
	//	t.Fatal(err)
	//}

	//fmt.Println(earliestAggregatedTs)
}

func verifyAggregatedTsOfInsertedEntries(
	t *testing.T,
	sqlConn *sqlutils.SQLRunner,
	fingerprint string,
	//nodeID roachpb.NodeID,
	tableName string,
	//hashColumnName string,
	//expectedAggregatedTsValues []time.Time,
) {
	// [1]: table name
	// [2]: hash column name
	stmt := fmt.Sprintf(`SELECT aggregated_ts FROM %[1]s WHERE metadata ->> 'query' = $1;`,
		tableName,
	)
	rows := sqlConn.Query(t, stmt, fingerprint)
	defer rows.Close()
	aggregatedTsValues := []time.Time{}

	for rows.Next() {
		var aggregatedTs time.Time
		if err := rows.Scan(&aggregatedTs); err != nil {
			t.Fatal(err)
		}
		fmt.Println("scanning", aggregatedTs)
		aggregatedTsValues = append(aggregatedTsValues, aggregatedTs)

	}
	// fixme: currently, the print output of this statement doesn't seem to output entries for the later time.
	// only the earlier one

}
