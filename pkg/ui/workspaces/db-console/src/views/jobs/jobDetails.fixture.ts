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
import Long from "long";
import { defaultJobProperties } from "src/views/jobs/jobsTable.fixture";

const history = createMemoryHistory({ initialEntries: ["/statements"] });

const failedWithoutRetriableErrors: Job = {
  ...defaultJobProperties,
  id: new Long(7003330561, 70312826),
  type: "SCHEMA CHANGE",
  description:
    "ALTER TABLE movr.public.user_promo_codes ADD FOREIGN KEY (city, user_id) REFERENCES movr.public.users (city, id)",
  status: "failed",
  error: "mock failure message",
  execution_failures: [],
};

export const jobDetailsProps: JobDetailsProps = {
  history,
  location: {
    pathname: "/jobs/760621514586259457",
    search: "",
    hash: "",
    state: undefined,
  },
  match: {
    path: "/jobs/:id",
    url: "/jobs/760621514586259457",
    isExact: true,
    params: { id: "/jobs/760621514586259457" },
  },
  sort: {
    columnTitle: "startTime",
    ascending: false,
  },
  setSort: () => {},
  refreshJob: () => null,
  job: failedWithoutRetriableErrors,
};
