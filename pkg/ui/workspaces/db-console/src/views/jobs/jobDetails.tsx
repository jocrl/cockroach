// Copyright 2018 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import { Col, Icon, Row } from "antd";
import _ from "lodash";
import Long from "long";
import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { cockroach } from "src/js/protos";
import { jobRequestKey, refreshJob } from "src/redux/apiReducers";
import { AdminUIState } from "src/redux/state";
import { getMatchParamByName } from "src/util/query";
import {
  Loading,
  SortedTable,
  util,
  SortSetting,
} from "@cockroachlabs/cluster-ui";
import SqlBox from "../shared/components/sql/box";
import { SummaryCard } from "../shared/components/summaryCard";

import Job = cockroach.server.serverpb.JobResponse;
import JobRequest = cockroach.server.serverpb.JobRequest;
import ExecutionFailure = cockroach.server.serverpb.JobResponse.IExecutionFailure;
import { Button } from "@cockroachlabs/cluster-ui";
import { ArrowLeft } from "@cockroachlabs/icons";
import { DATE_FORMAT } from "src/util/format";
import { JobStatusCell } from "./jobStatusCell";
import "src/views/shared/components/summaryCard/styles.styl";
import * as protos from "src/js/protos";
import { LocalSetting } from "src/redux/localsettings";
import styles from "./jobDetails.module.styl";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export interface JobDetailsProps extends RouteComponentProps {
  job: Job;
  sort: SortSetting;
  refreshJob: typeof refreshJob;
  setSort: (value: SortSetting) => void;
}

export class JobDetails extends React.Component<JobDetailsProps, {}> {
  refresh = (props = this.props) => {
    props.refreshJob(
      new JobRequest({
        job_id: Long.fromString(getMatchParamByName(props.match, "id")),
      }),
    );
  };

  componentDidMount() {
    this.refresh();
  }

  prevPage = () => this.props.history.goBack();

  renderRetriableJobErrors = (executionFailures: ExecutionFailure[]) => {
    const columns = [
      {
        title: "Error start time (UTC)",
        name: "startTime",
        cell: (executionFailure: ExecutionFailure) =>
          util
            .TimestampToMoment(executionFailure.start)
            .format("MMM D, YYYY [at] h:mm A"),
        sort: (executionFailure: ExecutionFailure) =>
          util.TimestampToMoment(executionFailure.start).valueOf(),
      },
      {
        title: "Error end time (UTC)",
        name: "endTime",
        cell: (executionFailure: ExecutionFailure) =>
          util
            .TimestampToMoment(executionFailure.end)
            .format("MMM D, YYYY [at] h:mm A"),
        sort: (executionFailure: ExecutionFailure) =>
          util.TimestampToMoment(executionFailure.end).valueOf(),
      },
      {
        title: "Error message",
        name: "message",
        cell: (executionFailure: ExecutionFailure) => (
          <div className={cx("errors-table__error-message")}>
            {executionFailure.error}
          </div>
        ),
        sort: (executionFailure: ExecutionFailure) => executionFailure.error,
      },
    ];
    return (
      <section>
        <h3 className="summary--card__status--title">Previous job errors</h3>
        <SortedTable
          data={executionFailures}
          className="errors-table"
          columns={columns}
          sortSetting={this.props.sort}
          onChangeSortSetting={this.props.setSort}
          renderNoResult={
            <div>
              <Icon
                className={cx("errors-table__no-errors-icon")}
                type={"check-circle"}
              />
              <span className={cx("errors-table__no-errors-message")}>
                No previous job errors occurred.
              </span>
            </div>
          }
        />
      </section>
    );
  };

  renderContent = () => {
    const { job } = this.props;
    return (
      <>
        <Row gutter={16}>
          <Col className="gutter-row" span={16}>
            <SqlBox value={job.description} />
            <SummaryCard>
              <h3 className="summary--card__status--title">Status</h3>
              <JobStatusCell job={job} lineWidth={1.5} />
            </SummaryCard>
          </Col>
          <Col className="gutter-row" span={8}>
            <SummaryCard>
              <Row>
                <Col span={24}>
                  <div className="summary--card__counting">
                    <h3 className="summary--card__counting--value">
                      {util.TimestampToMoment(job.created).format(DATE_FORMAT)}
                    </h3>
                    <p className="summary--card__counting--label">
                      Creation time
                    </p>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="summary--card__counting">
                    <h3 className="summary--card__counting--value">
                      {job.username}
                    </h3>
                    <p className="summary--card__counting--label">Users</p>
                  </div>
                </Col>
              </Row>
            </SummaryCard>
          </Col>
        </Row>
        <Row>{this.renderRetriableJobErrors(job.execution_failures)}</Row>
      </>
    );
  };

  render() {
    const { job, match } = this.props;
    return (
      <div className="job-details">
        <Helmet title={"Details | Job"} />
        <div className="section page--header">
          <Button
            onClick={this.prevPage}
            type="unstyled-link"
            size="small"
            icon={<ArrowLeft fontSize={"10px"} />}
            iconPosition="left"
            className="small-margin"
          >
            Jobs
          </Button>
          <h3 className="page--header__title">{`Job ID: ${String(
            getMatchParamByName(match, "id"),
          )}`}</h3>
        </div>
        <section className="section section--container">
          <Loading
            loading={_.isNil(job)}
            page={"job details"}
            render={this.renderContent}
          />
        </section>
      </div>
    );
  }
}

export const defaultSortSetting: SortSetting = {
  columnTitle: "startTime",
  ascending: false,
};

export const sortSetting = new LocalSetting<AdminUIState, SortSetting>(
  "sortSetting/JobDetails",
  s => s.localSettings,
  defaultSortSetting,
);

const mapStateToProps = (state: AdminUIState, props: RouteComponentProps) => {
  const sort = sortSetting.selector(state);

  const jobRequest = new protos.cockroach.server.serverpb.JobRequest({
    job_id: Long.fromString(getMatchParamByName(props.match, "id")),
  });
  const key = jobRequestKey(jobRequest);
  const jobData = state.cachedData.job[key];
  const job = jobData ? jobData.data : null;

  return {
    sort,
    job,
  };
};

const mapDispatchToProps = {
  setSort: sortSetting.set,
  refreshJob,
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDetails);
