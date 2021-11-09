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
import {
  allJobsFixture,
  retryRunningJobFixture,
} from "src/views/jobs/jobTable.fixture";
import { refreshJobs } from "src/redux/apiReducers";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
// import { SortSetting } from "src/views/shared/components/sortabletable";
import { ProviderWrapper, mockState } from "src/test-utils/testHelpers";
import { CachedDataReducerState } from "oss/src/redux/cachedDataReducer";

// todo
import JobsResponse = cockroach.server.serverpb.JobsResponse;
import Job = cockroach.server.serverpb.IJobResponse;
import Long from "long";
import * as protos from "oss/src/js";

const getMockJobsTableProps = (jobs: Array<Job>): JobsTableProps => ({
  sort: { sortKey: null, ascending: true },
  status: "",
  show: "50",
  type: 0,
  setSort: () => {},
  setStatus: () => {},
  setShow: () => {},
  setType: () => {},
  jobs: {
    data: {
      jobs: jobs,
      toJSON: () => ({}),
    },
    inFlight: false,
    valid: true,
  },
  refreshJobs,
});

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

  it("renders expected jobs table columns", () => {
    const { getByText } = render(
      <ProviderWrapper>
        <JobsTable {...getMockJobsTableProps(allJobsFixture)} />
      </ProviderWrapper>,
    );
    const expectedColumnTitles = [
      "Description",
      "Status",
      "Job ID",
      "User",
      "Creation Time (UTC)",
      "Last Execution Time (UTC)",
      "Execution Count",
    ];

    for (const columnTitle of expectedColumnTitles) {
      getByText(columnTitle);
    }
    // getByText("columnTitle");
  });

  it.only("shows next execution time on hovering a retry status", () => {
    const { getByText, debug } = render(
      <ProviderWrapper>
        <JobsTable {...getMockJobsTableProps([retryRunningJobFixture])} />
      </ProviderWrapper>,
    );
    const retryingBadge = getByText("retrying");
    userEvent.hover(retryingBadge);
    await waitFor(
      () => screen.getByText("Execution"),
      // expect(screen.getByText(revealable.value)).toBeDefined(),
    );
    // await
    debug(undefined, 100000);
  });
});
