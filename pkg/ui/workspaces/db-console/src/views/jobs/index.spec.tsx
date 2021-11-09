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
import moment from "moment";
import { cockroach } from "src/js/protos";
import { formatDuration } from ".";
// import { JobTable, JobTableProps } from "src/views/jobs/jobTable";
import { JobsTable, JobsTableProps } from "src/views/jobs/index";
import { refreshJobs } from "src/redux/apiReducers";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
// import { SortSetting } from "src/views/shared/components/sortabletable";
import { ProviderWrapper, mockState } from "src/test-utils/testHelpers";
import { CachedDataReducerState } from "oss/src/redux/cachedDataReducer";

// todo
import JobsResponse = cockroach.server.serverpb.JobsResponse;
import Long from "long";
import * as protos from "oss/src/js";

describe("Jobs", () => {
  it("format duration", () => {
    assert.equal(formatDuration(moment.duration(0)), "00:00:00");
    assert.equal(formatDuration(moment.duration(5, "minutes")), "00:05:00");
    assert.equal(formatDuration(moment.duration(5, "hours")), "05:00:00");
    assert.equal(formatDuration(moment.duration(110, "hours")), "110:00:00");
    assert.equal(
      formatDuration(moment.duration(12345, "hours")),
      "12345:00:00",
    );
  });

  it.only("has a jobs table", () => {
    const initialJobs = [
      {
        id: new Long(8136728577, 70289336),
        type: "AUTO SQL STATS COMPACTION",
        description: "automatic SQL Stats compaction",
        username: "node",
        status: "succeeded",
        created: new protos.google.protobuf.Timestamp({
          seconds: new Long(1634648118),
          nanos: 200459000,
        }),
        started: new protos.google.protobuf.Timestamp({
          seconds: new Long(1634648118),
          nanos: 215527000,
        }),
        finished: new protos.google.protobuf.Timestamp({
          seconds: new Long(1634648118),
          nanos: 311522000,
        }),
        modified: new protos.google.protobuf.Timestamp({
          seconds: new Long(1634648118),
          nanos: 310899000,
        }),
        fraction_completed: 1,
        last_run: new protos.google.protobuf.Timestamp({
          seconds: new Long(1634648118),
          nanos: 215527000,
        }),
        next_run: new protos.google.protobuf.Timestamp({
          seconds: new Long(1634648118),
          nanos: 215527100,
        }),
        num_runs: new Long(1),
      },
    ];
    const initialState = mockState({
      cachedData: {
        // jobs: new CachedDataReducerState<JobsResponse>({}),
        jobs: {
          "/0/50": {
            // TODO(Josephine) what's up with the keyed cache? what should the key be?
            inFlight: false,
            valid: true,
            data: {
              jobs: initialJobs,
            },
          },
        },
        // {
        //       inFlight: false,
        //       valid: false,
        //       requestedAt: "2021-11-09T15:30:03.466Z",
        //       setAt: "2021-11-09T15:30:05.149Z",
        //       lastError: null,
        //     },
      },
    });
    const toJSON = () => {
      return [""];
    };
    const jobsTableProps: JobsTableProps = {
      sort: { sortKey: null, ascending: true },
      status: "",
      show: "50",
      type: 0,
      setSort: () => {},
      setStatus: () => {},
      setShow: () => {},
      setType: () => {},
      jobs: {
        data: { jobs: initialJobs, toJSON },
        inFlight: false,
        valid: true,
      },
      refreshJobs,
    };
    const { getByText } = render(
      <ProviderWrapper hookAPIs initialState={initialState}>
        <JobsTable {...jobsTableProps} />
      </ProviderWrapper>,
    );
    getByText("Description");
    // getByText("fake");
  });
  // it.only("should have the expected columns", () => {
  //   const toJSON = () => {
  //     return [""];
  //   };
  //   const jobsTableProps: JobsTableProps = {
  //     sort: { sortKey: null, ascending: true },
  //     setSort: () => {},
  //     setStatus: () => {},
  //     setShow: () => {},
  //     setType: () => {},
  //     jobs: {
  //       data: { jobs: [{}, {}, {}, {}], toJSON },
  //       inFlight: false,
  //       valid: true,
  //     },
  //     current: 2,
  //     pageSize: 2,
  //     isUsedFilter: true,
  //   };
  //   const { getByText } = render(
  //     <MemoryRouter>
  //       <JobsTable {...jobsTableProps} />
  //     </MemoryRouter>,
  //   );
  //
  //   const expectedColumnTitles = [
  //     "Description",
  //     "Status",
  //     "Job ID",
  //     "User",
  //     "Creation Time (UTC)",
  //     "Last Execution Time (UTC)",
  //     "Execution Count",
  //   ];
  //
  //   for (const columnTitle of expectedColumnTitles) {
  //     getByText(columnTitle);
  //   }
  // });
});
