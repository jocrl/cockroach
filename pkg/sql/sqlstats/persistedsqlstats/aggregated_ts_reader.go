// Copyright 2021 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

package persistedsqlstats

import (
	"context"
	"fmt"
	"github.com/cockroachdb/cockroach/pkg/security"
	"github.com/cockroachdb/cockroach/pkg/sql/catalog/systemschema"
	"github.com/cockroachdb/cockroach/pkg/sql/sem/tree"
	"github.com/cockroachdb/cockroach/pkg/sql/sessiondata"
	"github.com/cockroachdb/cockroach/pkg/sql/sqlutil"
	"time"
)

func (s *PersistedSQLStats) ScanEarliestAggregatedTs(
	ctx context.Context, ie *sqlutil.InternalExecutor, tableName, hashColumnName string,
	//ctx context.Context, tableName, hashColumnName, pkColumnNames string,
) (time.Time, error) {
	earliestAggregatedTsPerShard := make([]time.Time, systemschema.SQLStatsHashShardBucketCount)
	fmt.Println("hi1")
	for shardIdx := int64(0); shardIdx < systemschema.SQLStatsHashShardBucketCount; shardIdx++ {
		stmt := s.getStatementForEarliestAggregatedTs(tableName, hashColumnName)
		row, err := ie.QueryRowEx(ctx, "scan-earliest-aggregated-ts", nil, sessiondata.InternalExecutorOverride{User: security.RootUserName()}, stmt, shardIdx)
		fmt.Println("hi loop", shardIdx)
		if err != nil {
			fmt.Println("hi loop 2", shardIdx)
			return time.Time{}, err
		}
		if row == nil {
			fmt.Println("hi loop 3", shardIdx)
			earliestAggregatedTsPerShard[shardIdx] = time.Time{}
		} else {
			fmt.Println("hi loop 4", shardIdx)
			shardEarliestAggregatedTs := tree.MustBeDTimestampTZ(row[0]).Time
			fmt.Println("hi loop 5", shardIdx)
			earliestAggregatedTsPerShard[shardIdx] = shardEarliestAggregatedTs
		}
	}
	fmt.Println("hi2")
	var earliestAggregatedTs time.Time

	fmt.Println("hi3")
	for _, shardEarliestAggregatedTs := range earliestAggregatedTsPerShard {
		if !shardEarliestAggregatedTs.IsZero() && shardEarliestAggregatedTs.Before(earliestAggregatedTs) {
			earliestAggregatedTs = shardEarliestAggregatedTs
		}
		fmt.Println("hi4")
	}

	// fixme(if none, query in-memory stats)

	return earliestAggregatedTs, nil
}

func (s *PersistedSQLStats) getStatementForEarliestAggregatedTs(
	tableName, hashColumnName string,
) string {
	// [1]: table name
	// [2]: AOST clause
	// [3]: hash column name
	const stmt = `SELECT aggregated_ts FROM %[1]s %[2]s WHERE %[3]s = $1 ORDER BY aggregated_ts LIMIT 1;`
	followerReadClause := "AS OF SYSTEM TIME follower_read_timestamp()"

	if s.cfg.Knobs != nil {
		followerReadClause = s.cfg.Knobs.AOSTClause
	}

	return fmt.Sprintf(stmt,
		tableName,
		followerReadClause,
		hashColumnName,
	)
}
