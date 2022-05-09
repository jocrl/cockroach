// Copyright 2022 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import { JobDetailsProps } from "src/views/jobs/jobDetails";
import moment from "moment";
import * as protos from "@cockroachlabs/crdb-protobuf-client";
import { cockroach } from "src/js/protos";
import JobsResponse = cockroach.server.serverpb.JobsResponse;
import Job = cockroach.server.serverpb.IJobResponse;
import { createMemoryHistory } from "history";

const history = createMemoryHistory({ initialEntries: ["/statements"] });

export const jobDetailsProps: JobDetailsProps = {
  history,
  location: {
    pathname: "/fixme",
    search: "",
    hash: "",
    state: null,
  },
  match: {
    path: "/fixme",
    url: "/fixme",
    isExact: true,
    params: "{}",
  },
  sort: {
    columnTitle: "startTime",
    ascending: false,
  },
  setSort: () => {},
  refreshJob: () => null,
};
