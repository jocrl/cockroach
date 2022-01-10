// Copyright 2022 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

package sqlstats

import (
	""
	"time"
)

func ComputeAggregatedTs() time.Time {
	interval := SQLStatsFlushInterval.Get(&s.cfg.Settings.SV)
	now := getTimeNow()

	aggTs := now.Truncate(interval)
	//aggTs := persistedsqlstats.PersistedSQLStats.ComputeAggregatedTs()
	return aggTs
}

func getTimeNow() time.Time {
	if s.cfg.Knobs != nil && s.cfg.Knobs.StubTimeNow != nil {
		return s.cfg.Knobs.StubTimeNow()
	}

	return timeutil.Now()
}

