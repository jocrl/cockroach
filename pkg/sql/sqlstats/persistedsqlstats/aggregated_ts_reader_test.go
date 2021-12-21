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
	"github.com/cockroachdb/cockroach/pkg/sql"
	"github.com/cockroachdb/cockroach/pkg/sql/catalog/systemschema"
	"github.com/cockroachdb/cockroach/pkg/sql/sqlstats/persistedsqlstats"
	"github.com/cockroachdb/cockroach/pkg/sql/tests"
	"github.com/cockroachdb/cockroach/pkg/testutils/serverutils"
	"github.com/cockroachdb/cockroach/pkg/util/leaktest"
	"github.com/cockroachdb/cockroach/pkg/util/log"
	"testing"
)

func TestScanEarliestAggregatedTs(t *testing.T) {
	defer leaktest.AfterTest(t)()
	defer log.Scope(t).Close(t)

	params, _ := tests.CreateTestServerParams()
	s, _, _ := serverutils.StartServer(t, params)

	ctx := context.Background()
	defer s.Stopper().Stop(ctx)

	sqlServer := s.(*TestServer).Server.sqlServer.pgServer.SQLServer
	sqlServer.GetSQLStatsProvider().(*persistedsqlstats.PersistedSQLStats).Flush(ctx)

	earliestAggregatedTs, err := sqlStats.ScanEarliestAggregatedTs(ctx, s.InternalExecutor().(*sql.InternalExecutor), "system.statement_statistics", systemschema.StmtStatsHashColumnName)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Println(earliestAggregatedTs)
}
