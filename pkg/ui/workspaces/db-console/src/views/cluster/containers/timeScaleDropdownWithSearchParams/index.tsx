// Copyright 2018 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import React, { useEffect, useRef } from "react";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { AdminUIState } from "src/redux/state";
import * as timewindow from "src/redux/timeScale";
import {
  defaultTimeScaleOptions,
  TimeScaleDropdown,
  TimeScaleDropdownProps,
  TimeScale,
  findClosestTimeScale,
  toDateRange,
} from "@cockroachlabs/cluster-ui";
import { statementsTimeScaleLocalSetting } from "src/redux/statementsTimeScale";
import moment from "moment";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// The time scale dropdown from cluster-ui that updates route params as
// options are selected.
const TimeScaleDropdownWithSearchParams = (
  props: TimeScaleDropdownProps,
): React.ReactElement => {
  const history = useHistory();
  // const queryParams = history.location.search;
  // const urlSearchParams = new URLSearchParams(queryParams);
  // const queryStartString = urlSearchParams.get("start");
  // const queryEndString = urlSearchParams.get("end");

  const { setTimeScale, currentScale } = props;
  const previousScale = usePrevious(currentScale);

  const {
    location: { pathname, search },
    push,
  } = history;

  useEffect(() => {
    const setTimeScaleFromQueryParams = (
      start: moment.Moment,
      end: moment.Moment,
    ) => {
      const seconds = end.diff(start, "seconds");

      // Find the closest time scale just by window size.
      // And temporarily assume the end is "now" with fixedWindowEnd=false.
      const timeScale: TimeScale = {
        ...findClosestTimeScale(defaultTimeScaleOptions, seconds),
        windowSize: moment.duration(end.diff(start)),
        fixedWindowEnd: false,
      };

      // Check if the end is close to now, with "close" defined as being no more than `sampleSize` behind.
      const now = moment.utc();
      if (now > end.clone().add(timeScale.sampleSize)) {
        // The end is far enough away from now, thus this is a custom selection.
        timeScale.key = "Custom";
        timeScale.fixedWindowEnd = end;
      }
      setTimeScale(timeScale);
    };

    const setQueryParamsFromTimeScale = () => {
      const [start, end] = toDateRange(currentScale);
      const urlParams = new URLSearchParams(search);
      urlParams.set("start", moment.utc(start).format("X"));
      urlParams.set("end", moment.utc(end).format("X"));

      push({
        pathname,
        search: urlParams.toString(),
      });
    };

    const urlSearchParams = new URLSearchParams(search);
    const queryStartString = urlSearchParams.get("start");
    const queryEndString = urlSearchParams.get("end");

    // if this was triggered by a change in time scale (other than initialization), follow the changing timescale
    if (!_.isEqual(previousScale, currentScale) && previousScale != undefined) {
      if (queryStartString && queryEndString) {
        //  there are query params
        const queryStart = moment.unix(Number(queryStartString)).utc();
        const queryEnd = moment.unix(Number(queryEndString)).utc();
        const [stateStart, stateEnd] = toDateRange(currentScale);
        if (!queryStart.isSame(stateStart) || !queryEnd.isSame(stateEnd)) {
          // override the query params with the value from scale, if they are discrepant
          setQueryParamsFromTimeScale();
        }
        //  else, don't do anything. query params and state are already in sync.
      } else {
        setQueryParamsFromTimeScale();
      }
    } else {
      // else, this was triggered by something other than a change in time scale, e.g. landing on the page or a change in route
      // follow the query params if available, else follow the time scale
      if (queryStartString && queryEndString) {
        //  there are query params
        const queryStart = moment.unix(Number(queryStartString)).utc();
        const queryEnd = moment.unix(Number(queryEndString)).utc();
        const [stateStart, stateEnd] = toDateRange(currentScale);
        if (!queryStart.isSame(stateStart) || !queryEnd.isSame(stateEnd)) {
          setTimeScaleFromQueryParams(queryStart, queryEnd);
        }
        //  else, don't do anything. query params and state are already in sync.
      } else {
        setQueryParamsFromTimeScale();
      }
    }
  }, [previousScale, currentScale, setTimeScale, push, pathname, search]);

  const onTimeScaleChange = (timeScale: TimeScale) => {
    props.setTimeScale(timeScale);
  };

  return <TimeScaleDropdown {...props} setTimeScale={onTimeScaleChange} />;
};

export default connect(
  (state: AdminUIState) => ({
    currentScale: statementsTimeScaleLocalSetting.selector(state),
  }),
  {
    setTimeScale: timewindow.setTimeScale,
  },
)(TimeScaleDropdownWithSearchParams);
