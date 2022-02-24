// Copyright 2018 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import { assert } from "chai";
import { localSettingsReducer } from "./localsettings";
import * as timeScale from "./timeScale";
import moment from "moment";
import { TimeScale } from "./timeScale";

describe("time scale reducer", function() {
  describe("actions", function() {
    it("should create the correct SET_METRICS_MOVING_WINDOW action to set the current time window", function() {
      const start = moment();
      const end = start.add(10, "s");
      const expectedSetting = {
        type: timeScale.SET_METRICS_MOVING_WINDOW,
        payload: {
          start,
          end,
        },
      };
      assert.deepEqual(
        timeScale.setMetricsMovingWindow({ start, end }),
        expectedSetting,
      );
    });

    it("should create the correct SET_SCALE action to set time window settings", function() {
      const payload: timeScale.TimeScale = {
        windowSize: moment.duration(10, "s"),
        windowValid: moment.duration(10, "s"),
        sampleSize: moment.duration(10, "s"),
        fixedWindowEnd: false,
      };
      assert.deepEqual(timeScale.setTimeScale(payload), {
        type: timeScale.SET_SCALE,
        payload,
      });
    });
  });

  describe("reducer", () => {
    it("should have the correct default value.", () => {
      assert.deepEqual(
        timeScale.metricsTimeReducer(undefined, { type: "unknown" }),
        new timeScale.MetricsTimeState(),
      );
    });

    describe("setMetricsMovingWindow", () => {
      const start = moment();
      const end = start.add(10, "s");
      it("should correctly overwrite previous value", () => {
        const expected = new timeScale.MetricsTimeState();
        expected.metricsTime.currentWindow = {
          start,
          end,
        };
        expected.metricsTime.shouldUpdateMetricsWindowFromScale = false;
        assert.deepEqual(
          timeScale.metricsTimeReducer(
            undefined,
            timeScale.setMetricsMovingWindow({ start, end }),
          ),
          expected,
        );
      });
    });

    describe("setTimeScale", () => {
      // const newSize =
      // const newValid =
      // const newSample =
      const newTimeScale: TimeScale = {
        windowSize: moment.duration(1, "h"),
        windowValid: moment.duration(1, "m"),
        sampleSize: moment.duration(1, "m"),
        fixedWindowEnd: false,
      };
      const action = timeScale.setTimeScale(newTimeScale);
      it("should correctly overwrite the metricsTime slice", () => {
        const expectedMetricsTime = new timeScale.MetricsTimeState();
        expectedMetricsTime.metricsTime.shouldUpdateMetricsWindowFromScale = true;
        assert.deepEqual(
          timeScale.metricsTimeReducer(undefined, action),
          expectedMetricsTime,
        );
      });
      it("should correctly overwrite the localSettings slice", () => {
        const expectedLocalSettings = { "timeScale/SQLActivity": newTimeScale };
        assert.deepEqual(
          localSettingsReducer(undefined, action),
          expectedLocalSettings,
        );
      });
    });
  });
});
