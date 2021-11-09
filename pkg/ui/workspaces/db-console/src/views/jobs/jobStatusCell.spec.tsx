// // Copyright 2018 The Cockroach Authors.
// //
// // Use of this software is governed by the Business Source License
// // included in the file licenses/BSL.txt.
// //
// // As of the Change Date specified in that file, in accordance with
// // the Business Source License, use of this software will be governed
// // by the Apache License, Version 2.0, included in the file
// // licenses/APL.txt.
//
// import React from "react";
// // import { shallow } from "enzyme";
// import { assert } from "chai";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import {
//   JobStatusCell,
//   JobStatusCellProps,
// } from "src/views/jobs/jobStatusCell";
// import "src/enzymeInit";
//
// describe("<JobStatusCell>", () => {
//   it.only("should show next execution time on hover", () => {
//     const jobStatusCellProps: JobStatusCellProps = {
//       job: {
//         status: "retry-running",
//       },
//     };
//     const { container, getByText } = render(
//       <JobStatusCell {...jobStatusCellProps} />,
//     );
//     userEvent.hover(container.firstChild);
//     // userEvent.hover(getByText("retrying"));
//     screen.getByText("Execution");
//     // screen.getByText("Next Execution Time:");
//     // getByText("fake");
//   });
//
//   it("should reset page to 1 after job list prop changes", () => {
//     const toJSON = () => {
//       return [""];
//     };
//     const jobTableProps: JobTableProps = {
//       sort: { sortKey: null, ascending: true },
//       setSort: () => {},
//       jobs: {
//         data: { jobs: [{}, {}, {}, {}], toJSON },
//         inFlight: false,
//         valid: true,
//       },
//       current: 2,
//       pageSize: 2,
//       isUsedFilter: true,
//     };
//     const jobTable = shallow<JobTable>(
//       <JobTable
//         jobs={jobTableProps.jobs}
//         sort={jobTableProps.sort}
//         setSort={jobTableProps.setSort}
//         current={jobTableProps.current}
//         pageSize={jobTableProps.pageSize}
//         isUsedFilter={jobTableProps.isUsedFilter}
//       />,
//     );
//     assert.equal(jobTable.state().pagination.current, 2);
//     jobTable.setProps({
//       jobs: { data: { jobs: [{}, {}], toJSON }, inFlight: false, valid: true },
//     });
//     assert.equal(jobTable.state().pagination.current, 1);
//   });
// });
