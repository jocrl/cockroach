// Copyright 2021 The Cockroach Authors.
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
	"github.com/cockroachdb/cockroach/pkg/sql"
	"github.com/cockroachdb/cockroach/pkg/sql/catalog/systemschema"
	"github.com/cockroachdb/cockroach/pkg/sql/sqlstats/persistedsqlstats"
	"github.com/cockroachdb/cockroach/pkg/sql/tests"
	"github.com/cockroachdb/cockroach/pkg/testutils/serverutils"
	"github.com/cockroachdb/cockroach/pkg/testutils/sqlutils"
	"time"

	"github.com/cockroachdb/cockroach/pkg/util/leaktest"
	"github.com/cockroachdb/cockroach/pkg/util/log"
	"testing"
)

func TestScanEarliestAggregatedTsPersistedExists(t *testing.T) {
	defer leaktest.AfterTest(t)()
	defer log.Scope(t).Close(t)

	params, _ := tests.CreateTestServerParams()
	s, db, _ := serverutils.StartServer(t, params)

	ctx := context.Background()
	defer s.Stopper().Stop(ctx)

	sqlStats := s.SQLServer().(*sql.Server).GetSQLStatsProvider().(*persistedsqlstats.PersistedSQLStats)
	sqlConn := sqlutils.MakeSQLRunner(db)
	// set up multiple persisted times, also in-memory

	expectedStmtFingerprints := make(map[string]int64)
	for _, tc := range testQueries {
		expectedStmtFingerprints[tc.fingerprint] = tc.count
		for i := int64(0); i < tc.count; i++ {
			sqlConn.Exec(t, tc.query)
		}
	}

	// fixme how does it end up on diff shards? guarantee that we check all
	// fixme generate different times

	t.Run("in-memory only read", func(t *testing.T) {
		earliestAggregatedTs, err := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
		fmt.Println("mem", earliestAggregatedTs)
		if err != nil {
			t.Fatal(err)
		}
	})

	t.Run("disk only read", func(t *testing.T) {
		sqlStats.Flush(ctx)
		time.Sleep(10) // fixme unclear if bad idea cos makes test wait

		for _, tc := range testQueries {
			expectedStmtFingerprints[tc.fingerprint] = tc.count
			for i := int64(0); i < tc.count; i++ {
				sqlConn.Exec(t, tc.query)
			}
		}
		sqlStats.Flush(ctx)

		earliestAggregatedTs, err := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
		fmt.Println("disk", earliestAggregatedTs)
		if err != nil {
			t.Fatal(err)
		}
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

	fmt.Println(earliestAggregatedTs)
}
