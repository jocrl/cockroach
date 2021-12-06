// Copyright 2021 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import moment from "moment";
import { LocalSetting } from "./localsettings";
import { AdminUIState } from "./state";
import { defaultTimeScaleOptions } from "@cockroachlabs/cluster-ui";

export type CombinedStatementsTimeScalePayload = {
  key?: string;
  windowSize: moment.Duration;
  windowValid?: moment.Duration;
  sampleSize: moment.Duration;
  windowEnd?: moment.Moment;
};

const localSettingsSelector = (state: AdminUIState) => state.localSettings;

// The default range for statements to display is one hour ago.
const oneHourAgo = defaultTimeScaleOptions["Past 1 Hour"];
//   {
//   start: moment
//     .utc()
//     .subtract(1, "hours")
//     .unix(),
//   end: moment.utc().unix() + 60, // Add 1 minute to account for potential lag
// };

export const statementsTimeScaleLocalSetting = new LocalSetting<
  AdminUIState,
  CombinedStatementsTimeScalePayload
>("statements_time_scale", localSettingsSelector, oneHourAgo);
