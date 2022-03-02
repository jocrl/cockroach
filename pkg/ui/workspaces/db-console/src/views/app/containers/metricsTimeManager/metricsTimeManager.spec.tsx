// Copyright 2018 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import React from "react";
import { assert } from "chai";
import { shallow } from "enzyme";
import * as sinon from "sinon";
import moment from "moment";
import _ from "lodash";

import "src/enzymeInit";
import { MetricsTimeManagerUnconnected as MetricsTimeManager } from "./";
import * as timewindow from "src/redux/timeScale";
import { defaultTimeScaleSelected } from "@cockroachlabs/cluster-ui";
import { TimeScale } from "src/redux/timeScale";

describe("<MetricsTimeManager>", function() {
  let spy: sinon.SinonSpy;
  let metricsTimeState: timewindow.MetricsTimeState;
  let timeScaleState: TimeScale;
  const now = () => moment("11-12-1955 10:04PM -0800", "MM-DD-YYYY hh:mma Z");

  beforeEach(function() {
    spy = sinon.spy();
    metricsTimeState = new timewindow.MetricsTimeState();
    timeScaleState = _.clone(defaultTimeScaleSelected);
  });

  const getManager = () =>
    shallow(
      <MetricsTimeManager
        metricsTime={_.clone(metricsTimeState)}
        timeScale={_.clone(timeScaleState)}
        setMetricsMovingWindow={spy}
        now={now}
      />,
    );

  it("resets time window immediately it is empty", function() {
    getManager();
    assert.isTrue(spy.calledOnce);
    assert.deepEqual(spy.firstCall.args[0], {
      start: now().subtract(timeScaleState.windowSize),
      end: now(),
    });
  });

  it("resets time window immediately if expired", function() {
    metricsTimeState.metricsTime.currentWindow = {
      start: now().subtract(timeScaleState.windowSize),
      end: now()
        .subtract(timeScaleState.windowValid)
        .subtract(1),
    };

    getManager();
    assert.isTrue(spy.calledOnce);
    assert.deepEqual(spy.firstCall.args[0], {
      start: now().subtract(timeScaleState.windowSize),
      end: now(),
    });
  });

  it("resets time window immediately if scale has changed", function() {
    // valid window.
    metricsTimeState.metricsTime.currentWindow = {
      start: now().subtract(timeScaleState.windowSize),
      end: now(),
    };
    metricsTimeState.metricsTime.shouldUpdateMetricsWindowFromScale = true;

    getManager();
    assert.isTrue(spy.calledOnce);
    assert.deepEqual(spy.firstCall.args[0], {
      start: now().subtract(timeScaleState.windowSize),
      end: now(),
    });
  });

  it("resets time window later if current window is valid", function() {
    metricsTimeState.metricsTime.currentWindow = {
      start: now().subtract(timeScaleState.windowSize),
      // 5 milliseconds until expiration.
      end: now().subtract(timeScaleState.windowValid.asMilliseconds() - 5),
    };

    getManager();
    assert.isTrue(spy.notCalled);

    // Wait 11 milliseconds, then verify that window was updated.
    return new Promise<void>((resolve, _reject) => {
      setTimeout(() => {
        assert.isTrue(spy.calledOnce);
        assert.deepEqual(spy.firstCall.args[0], {
          start: now().subtract(timeScaleState.windowSize),
          end: now(),
        });
        resolve();
      }, 6);
    });
  });

  // TODO (maxlang): Fix this test to actually change the state to catch the
  // issue that caused #7590. Tracked in #8595.
  it("has only a single timeout at a time.", function() {
    metricsTimeState.metricsTime.currentWindow = {
      start: now().subtract(timeScaleState.windowSize),
      // 5 milliseconds until expiration.
      end: now().subtract(timeScaleState.windowValid.asMilliseconds() - 5),
    };

    const manager = getManager();
    assert.isTrue(spy.notCalled);

    // Set new props on currentWindow. The previous timeout should be abandoned.
    metricsTimeState.metricsTime.currentWindow = {
      start: now().subtract(timeScaleState.windowSize),
      // 10 milliseconds until expiration.
      end: now().subtract(timeScaleState.windowValid.asMilliseconds() - 10),
    };
    manager.setProps({
      timeWindow: metricsTimeState,
    });
    assert.isTrue(spy.notCalled);

    // Wait 11 milliseconds, then verify that window was updated a single time.
    return new Promise<void>((resolve, _reject) => {
      setTimeout(() => {
        assert.isTrue(spy.calledOnce);
        assert.deepEqual(spy.firstCall.args[0], {
          start: now().subtract(timeScaleState.windowSize),
          end: now(),
        });
        resolve();
      }, 11);
    });
  });
});
