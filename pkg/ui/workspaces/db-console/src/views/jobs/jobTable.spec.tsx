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
import { shallow } from "enzyme";
import { assert } from "chai";
import { render } from "@testing-library/react";
import { JobTable, JobTableProps } from "src/views/jobs/jobTable";
import { MemoryRouter } from "react-router-dom";
import "src/enzymeInit";

describe("<JobTable>", () => {
  // it.only("should have the expected columns", () => {
  //   const toJSON = () => {
  //     return [""];
  //   };
  //   const jobTableProps: JobTableProps = {
  //     sort: { sortKey: null, ascending: true },
  //     setSort: () => {},
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
  //       <JobTable {...jobTableProps} />
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

  it("should reset page to 1 after job list prop changes", () => {
    const toJSON = () => {
      return [""];
    };
    const jobTableProps: JobTableProps = {
      sort: { sortKey: null, ascending: true },
      setSort: () => {},
      jobs: {
        data: { jobs: [{}, {}, {}, {}], toJSON },
        inFlight: false,
        valid: true,
      },
      current: 2,
      pageSize: 2,
      isUsedFilter: true,
    };
    const jobTable = shallow<JobTable>(
      <JobTable
        jobs={jobTableProps.jobs}
        sort={jobTableProps.sort}
        setSort={jobTableProps.setSort}
        current={jobTableProps.current}
        pageSize={jobTableProps.pageSize}
        isUsedFilter={jobTableProps.isUsedFilter}
      />,
    );
    assert.equal(jobTable.state().pagination.current, 2);
    jobTable.setProps({
      jobs: { data: { jobs: [{}, {}], toJSON }, inFlight: false, valid: true },
    });
    assert.equal(jobTable.state().pagination.current, 1);
  });
});
