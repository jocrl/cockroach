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
import { formatDuration } from ".";
import { JobTable, JobTableProps } from "src/views/jobs/jobTable";
import { JobsTable, JobsTableProps } from "src/views/jobs/index";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { SortSetting } from "oss/src/views/shared/components/sortabletable";

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

  it.only("should have the expected columns", () => {
    const toJSON = () => {
      return [""];
    };
    const jobsTableProps: JobsTableProps = {
      sort: { sortKey: null, ascending: true },
      setSort: () => {},
      setStatus: () => {},
      setShow: () => {},
      setType: () => {},
      jobs: {
        data: { jobs: [{}, {}, {}, {}], toJSON },
        inFlight: false,
        valid: true,
      },
      current: 2,
      pageSize: 2,
      isUsedFilter: true,
    };
    const { getByText } = render(
      <MemoryRouter>
        <JobsTable {...jobTableProps} />
      </MemoryRouter>,
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
  });
});
