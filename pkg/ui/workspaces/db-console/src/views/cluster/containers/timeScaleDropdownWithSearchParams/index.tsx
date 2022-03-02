// Copyright 2018 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import React, { useEffect } from "react";
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
import useCustomCompareEffect from "use-custom-compare-effect";
import { statementsTimeScaleLocalSetting } from "src/redux/statementsTimeScale";
import moment from "moment";

// The time scale dropdown from cluster-ui that updates route params as
// options are selected.
const TimeScaleDropdownWithSearchParams = (
  props: TimeScaleDropdownProps,
): React.ReactElement => {
  const history = useHistory();
  const queryParams = history.location.search;
  const urlSearchParams = new URLSearchParams(queryParams);
  const queryStart = urlSearchParams.get("start");
  const queryEnd = urlSearchParams.get("end");

  const { setTimeScale, currentScale } = props;
  useEffect(() => {
    const setTimeScaleFromQueryParams = (
      queryStart: string,
      queryEnd: string,
    ) => {
      const start = moment.unix(Number(queryStart)).utc();
      const end = moment.unix(Number(queryEnd)).utc();
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

    // Query params take precedence. If they are present, set state from query params
    if (queryStart && queryEnd) {
      setTimeScaleFromQueryParams(queryStart, queryEnd);
    }
  }, [setTimeScale, queryStart, queryEnd]);

  const {
    location: { pathname, search },
    push,
  } = history;
  useEffect(() => {
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

    // Query params take precedence. If they are absent, set query params from state.
    if (!(queryStart && queryEnd)) {
      setQueryParamsFromTimeScale();
    }
  }, [queryStart, queryEnd, currentScale, push, pathname, search]);

  // const setQueryParamsByDates = (
  //   duration: moment.Duration,
  //   dateEnd: moment.Moment,
  // ) => {
  //   const { pathname, search } = history.location;
  //   const urlParams = new URLSearchParams(search);
  //   const seconds = duration.clone().asSeconds();
  //   const end = dateEnd.clone();
  //   const start = moment
  //     .utc(end)
  //     .subtract(seconds, "seconds")
  //     .format("X");
  //
  //   urlParams.set("start", start);
  //   urlParams.set("end", moment.utc(dateEnd).format("X"));
  //
  //   console.log(`pushing ${urlParams.toString()}`);
  //   history.push({
  //     pathname,
  //     search: urlParams.toString(),
  //   });
  // };

  const onTimeScaleChange = (timeScale: TimeScale) => {
    props.setTimeScale(timeScale);
    // todo(josephine) the line below needs to be moved to a useEffect
    // it would also set query params from other sources of changing state
    // setQueryParamsByDates(
    //   timeScale.windowSize,
    //   timeScale.fixedWindowEnd || moment.utc(),
    // );
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
