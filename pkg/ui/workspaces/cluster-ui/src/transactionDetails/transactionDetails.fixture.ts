// Copyright 2021 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import { RequestError, TimestampToString } from "../util";
import moment from "moment";
import { createMemoryHistory } from "history";
import Long from "long";
import * as protos from "@cockroachlabs/crdb-protobuf-client";
import { TimeScale } from "../timeScaleDropdown";
import { StatementsResponse } from "src/store/sqlStats/sqlStats.reducer";

const history = createMemoryHistory({ initialEntries: ["/transactions"] });
const timestamp = new protos.google.protobuf.Timestamp({
  seconds: new Long(Date.parse("Nov 26 2021 01:00:00 GMT") * 1e-3),
});
const timestampString = TimestampToString(timestamp);

export const routeProps = {
  history,
  location: {
    pathname: `/transaction/${timestampString}/3632089240731979669`,
    search: "",
    hash: "",
    state: {},
  },
  match: {
    path: "/transaction/:aggregated_ts/:txn_fingerprint_id",
    url: `/transaction/${timestampString}/3632089240731979669`,
    isExact: true,
    params: {
      aggregated_ts: timestampString,
      txn_fingerprint_id: new Long(3632089240731979669),
    },
  },
};

export const transactionDetails: { data: StatementsResponse } = {
  data: {
    statements: [
      {
        key: {
          key_data: {
            query: "SELECT * FROM crdb_internal.node_build_info",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: false,
            database: "movr",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(10850629028818446207),
            query_summary: "SELECT * FROM crdb_internal.node_build_info",
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(1),
          first_attempt_count: new Long(1),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 6,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.00017026,
            squared_diffs: 0,
          },
          plan_lat: {
            mean: 0.000188651,
            squared_diffs: 0,
          },
          run_lat: {
            mean: 0.000255685,
            squared_diffs: 0,
          },
          service_lat: {
            mean: 0.000629367,
            squared_diffs: 0,
          },
          overhead_lat: {
            mean: 0.000014771000000000012,
            squared_diffs: 0,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "virtual table",
              attrs: [
                {
                  key: "Table",
                  value: "node_build_info@primary",
                },
              ],
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 0,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 0,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(1),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 10240,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDML",
          last_exec_timestamp: {
            seconds: new Long(1650591005),
            nanos: 677408609,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["AgH6////nxoAAA4AAAAGBg=="],
        },
        id: new Long(4176684928840388768),
      },
      {
        key: {
          key_data: {
            query: "SET sql_safe_updates = _",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: false,
            database: "movr",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(5794495518355343743),
            query_summary: "SET sql_safe_updates = _",
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(1),
          first_attempt_count: new Long(1),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 0,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.000045175,
            squared_diffs: 0,
          },
          plan_lat: {
            mean: 0.000065382,
            squared_diffs: 0,
          },
          run_lat: {
            mean: 0.000131952,
            squared_diffs: 0,
          },
          service_lat: {
            mean: 0.000250045,
            squared_diffs: 0,
          },
          overhead_lat: {
            mean: 0.00000753599999999999,
            squared_diffs: 0,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "set",
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 0,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 0,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(1),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 10240,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDCL",
          last_exec_timestamp: {
            seconds: new Long(1650591005),
            nanos: 801046328,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["Ais="],
        },
        id: new Long(18377382163116490400),
      },
      {
        key: {
          key_data: {
            query: "SHOW database",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: false,
            database: "movr",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(13649650089565100822),
            query_summary: "SHOW database",
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(4),
          first_attempt_count: new Long(4),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 1,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.00003328125,
            squared_diffs: 6.353567067500001e-10,
          },
          plan_lat: {
            mean: 0.000489767,
            squared_diffs: 1.2074998220000006e-8,
          },
          run_lat: {
            mean: 0.00094816775,
            squared_diffs: 2.1800142656749982e-8,
          },
          service_lat: {
            mean: 0.00148719125,
            squared_diffs: 4.749038607875007e-8,
          },
          overhead_lat: {
            mean: 0.000015975249999999972,
            squared_diffs: 2.3036310750002297e-11,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "filter",
              attrs: [
                {
                  key: "Filter",
                  value: "variable = _",
                },
              ],
              children: [
                {
                  name: "virtual table",
                  attrs: [
                    {
                      key: "Table",
                      value: "session_variables@primary",
                    },
                  ],
                },
              ],
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 0,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 0,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(2),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 10240,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDML",
          last_exec_timestamp: {
            seconds: new Long(1650591014),
            nanos: 380525340,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["AgGc////nxoAAAYAAAADBQIGAg=="],
        },
        id: new Long(1301242584620444873),
      },
      {
        key: {
          key_data: {
            query: "SELECT * FROM users",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: true,
            database: "movr",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(13388351560861020642),
            query_summary: "SELECT * FROM users",
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(2),
          first_attempt_count: new Long(2),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 8,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.000066329,
            squared_diffs: 6.509404999999994e-11,
          },
          plan_lat: {
            mean: 0.0004147245,
            squared_diffs: 7.797132564500002e-9,
          },
          run_lat: {
            mean: 0.0036602285,
            squared_diffs: 0.000005232790426512499,
          },
          service_lat: {
            mean: 0.0041592605,
            squared_diffs: 0.0000056896068047405,
          },
          overhead_lat: {
            mean: 0.00001797850000000048,
            squared_diffs: 1.9345445000014194e-12,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "scan",
              attrs: [
                {
                  key: "Estimated Row Count",
                  value: "8 (100% of the table; stats collected 20 days ago)",
                },
                {
                  key: "Spans",
                  value: "FULL SCAN",
                },
                {
                  key: "Table",
                  value: "users@users_pkey",
                },
              ],
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 918,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 8,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(2),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 20480,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDML",
          last_exec_timestamp: {
            seconds: new Long(1650591014),
            nanos: 178832951,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["AgHUAQIAHwAAAAYK"],
        },
        id: new Long(1634603821603440189),
      },
      {
        key: {
          key_data: {
            query: "SELECT * FROM crdb_internal.node_build_info",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: false,
            database: "defaultdb",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(10494895707609136838),
            query_summary: "SELECT * FROM crdb_internal.node_build_info",
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(1),
          first_attempt_count: new Long(1),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 6,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.000230192,
            squared_diffs: 0,
          },
          plan_lat: {
            mean: 0.000218323,
            squared_diffs: 0,
          },
          run_lat: {
            mean: 0.00040265,
            squared_diffs: 0,
          },
          service_lat: {
            mean: 0.000882119,
            squared_diffs: 0,
          },
          overhead_lat: {
            mean: 0.00003095399999999992,
            squared_diffs: 0,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "virtual table",
              attrs: [
                {
                  key: "Table",
                  value: "node_build_info@primary",
                },
              ],
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 0,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 0,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(1),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 10240,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDML",
          last_exec_timestamp: {
            seconds: new Long(1650578629),
            nanos: 206526803,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["AgH6////nxkAAA4AAAAGBg=="],
        },
        id: new Long(4523550567189039385),
      },
      {
        key: {
          key_data: {
            query: "SET sql_safe_updates = _",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: false,
            database: "defaultdb",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(5913510653911377094),
            query_summary: "SET sql_safe_updates = _",
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(1),
          first_attempt_count: new Long(1),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 0,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.000111899,
            squared_diffs: 0,
          },
          plan_lat: {
            mean: 0.00024584,
            squared_diffs: 0,
          },
          run_lat: {
            mean: 0.000174059,
            squared_diffs: 0,
          },
          service_lat: {
            mean: 0.000541064,
            squared_diffs: 0,
          },
          overhead_lat: {
            mean: 0.000009265999999999962,
            squared_diffs: 0,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "set",
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 0,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 0,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(1),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 10240,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDCL",
          last_exec_timestamp: {
            seconds: new Long(1650578629),
            nanos: 322452908,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["Ais="],
        },
        id: new Long(18262870370352730905),
      },
      {
        key: {
          key_data: {
            query: "SET database = movr",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: false,
            database: "movr",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(6275337403209787742),
            query_summary: "SET database = movr",
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(1),
          first_attempt_count: new Long(1),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 0,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.000045548,
            squared_diffs: 0,
          },
          plan_lat: {
            mean: 0.00010325,
            squared_diffs: 0,
          },
          run_lat: {
            mean: 0.000147325,
            squared_diffs: 0,
          },
          service_lat: {
            mean: 0.00030519,
            squared_diffs: 0,
          },
          overhead_lat: {
            mean: 0.000009066999999999973,
            squared_diffs: 0,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "set",
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 0,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 0,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(1),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 10240,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDCL",
          last_exec_timestamp: {
            seconds: new Long(1650578641),
            nanos: 789758405,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["Ais="],
        },
        id: new Long(17903435049656327809),
      },
      {
        key: {
          key_data: {
            query: "SHOW database",
            app: "$ cockroach sql",
            distSQL: false,
            failed: false,
            implicit_txn: true,
            vec: true,
            full_scan: false,
            database: "defaultdb",
            plan_hash: new Long(0),
            transaction_fingerprint_id: new Long(16021414429226128401),
            query_summary: "SHOW database",
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
        stats: {
          count: new Long(2),
          first_attempt_count: new Long(2),
          max_retries: new Long(0),
          legacy_last_err: "",
          num_rows: {
            mean: 1,
            squared_diffs: 0,
          },
          parse_lat: {
            mean: 0.0000431285,
            squared_diffs: 7.017381844999998e-10,
          },
          plan_lat: {
            mean: 0.0004474555,
            squared_diffs: 3.667019160499999e-9,
          },
          run_lat: {
            mean: 0.0009565229999999999,
            squared_diffs: 5.2381781791999984e-8,
          },
          service_lat: {
            mean: 0.001463508,
            squared_diffs: 9.99778214480001e-8,
          },
          overhead_lat: {
            mean: 0.00001640100000000009,
            squared_diffs: 7.605000000011151e-14,
          },
          legacy_last_err_redacted: "",
          sensitive_info: {
            last_err: "",
            most_recent_plan_description: {
              name: "filter",
              attrs: [
                {
                  key: "Filter",
                  value: "variable = _",
                },
              ],
              children: [
                {
                  name: "virtual table",
                  attrs: [
                    {
                      key: "Table",
                      value: "session_variables@primary",
                    },
                  ],
                },
              ],
            },
            most_recent_plan_timestamp: {
              seconds: new Long(-2135596800),
            },
          },
          bytes_read: {
            mean: 0,
            squared_diffs: 0,
          },
          rows_read: {
            mean: 0,
            squared_diffs: 0,
          },
          exec_stats: {
            count: new Long(1),
            network_bytes: {
              mean: 0,
              squared_diffs: 0,
            },
            max_mem_usage: {
              mean: 10240,
              squared_diffs: 0,
            },
            contention_time: {
              mean: 0,
              squared_diffs: 0,
            },
            network_messages: {
              mean: 0,
              squared_diffs: 0,
            },
            max_disk_usage: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          sql_type: "TypeDML",
          last_exec_timestamp: {
            seconds: new Long(1650578636),
            nanos: 404903676,
          },
          nodes: [new Long(2)],
          rows_written: {
            mean: 0,
            squared_diffs: 0,
          },
          plan_gists: ["AgGc////nxkAAAYAAAADBQIGAg=="],
        },
        id: new Long(8157358977703142350),
      },
    ],
    last_reset: {
      seconds: new Long(1651000310),
      nanos: 419008978,
    },
    internal_app_name_prefix: "$ internal",
    transactions: [
      {
        stats_data: {
          statement_fingerprint_ids: ["1301242584620444873"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(4),
            max_retries: new Long(0),
            num_rows: {
              mean: 1,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.002153589,
              squared_diffs: 2.1742494644199986e-7,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.0000286245,
              squared_diffs: 6.962121899999995e-11,
            },
            bytes_read: {
              mean: 0,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 0,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(2),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 10240,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          transaction_fingerprint_id: new Long(13649650089565100822),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
      {
        stats_data: {
          statement_fingerprint_ids: ["18377382163116490400"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(1),
            max_retries: new Long(0),
            num_rows: {
              mean: 0,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.000759024,
              squared_diffs: 0,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.000027923,
              squared_diffs: 0,
            },
            bytes_read: {
              mean: 0,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 0,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(1),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 10240,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          transaction_fingerprint_id: new Long(5794495518355343743),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
      {
        stats_data: {
          statement_fingerprint_ids: ["4176684928840388768"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(1),
            max_retries: new Long(0),
            num_rows: {
              mean: 6,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.001121754,
              squared_diffs: 0,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.000021931,
              squared_diffs: 0,
            },
            bytes_read: {
              mean: 0,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 0,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(1),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 10240,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          transaction_fingerprint_id: new Long(10850629028818446207),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
      {
        stats_data: {
          statement_fingerprint_ids: ["1634603821603440189"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(2),
            max_retries: new Long(0),
            num_rows: {
              mean: 8,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.0047974385,
              squared_diffs: 0.0000059061373681005006,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.000031955499999999996,
              squared_diffs: 1.4620500000000385e-14,
            },
            bytes_read: {
              mean: 918,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 8,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(2),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 20480,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650589200),
          },
          transaction_fingerprint_id: new Long(13388351560861020642),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
      {
        stats_data: {
          statement_fingerprint_ids: ["4523550567189039385"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(1),
            max_retries: new Long(0),
            num_rows: {
              mean: 6,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.001490162,
              squared_diffs: 0,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.000017778,
              squared_diffs: 0,
            },
            bytes_read: {
              mean: 0,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 0,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(1),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 10240,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          transaction_fingerprint_id: new Long(10494895707609136838),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
      {
        stats_data: {
          statement_fingerprint_ids: ["8157358977703142350"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(2),
            max_retries: new Long(0),
            num_rows: {
              mean: 1,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.002102965,
              squared_diffs: 8.283264020000005e-8,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.0000381505,
              squared_diffs: 2.857723245e-10,
            },
            bytes_read: {
              mean: 0,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 0,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(1),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 10240,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          transaction_fingerprint_id: new Long(16021414429226128401),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
      {
        stats_data: {
          statement_fingerprint_ids: ["17903435049656327809"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(1),
            max_retries: new Long(0),
            num_rows: {
              mean: 0,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.000815042,
              squared_diffs: 0,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.000029068,
              squared_diffs: 0,
            },
            bytes_read: {
              mean: 0,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 0,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(1),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 10240,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          transaction_fingerprint_id: new Long(6275337403209787742),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
      {
        stats_data: {
          statement_fingerprint_ids: ["18262870370352730905"],
          app: "$ cockroach sql",
          stats: {
            count: new Long(1),
            max_retries: new Long(0),
            num_rows: {
              mean: 0,
              squared_diffs: 0,
            },
            service_lat: {
              mean: 0.001094508,
              squared_diffs: 0,
            },
            retry_lat: {
              mean: 0,
              squared_diffs: 0,
            },
            commit_lat: {
              mean: 0.000025367,
              squared_diffs: 0,
            },
            bytes_read: {
              mean: 0,
              squared_diffs: 0,
            },
            rows_read: {
              mean: 0,
              squared_diffs: 0,
            },
            exec_stats: {
              count: new Long(1),
              network_bytes: {
                mean: 0,
                squared_diffs: 0,
              },
              max_mem_usage: {
                mean: 10240,
                squared_diffs: 0,
              },
              contention_time: {
                mean: 0,
                squared_diffs: 0,
              },
              network_messages: {
                mean: 0,
                squared_diffs: 0,
              },
              max_disk_usage: {
                mean: 0,
                squared_diffs: 0,
              },
            },
            rows_written: {
              mean: 0,
              squared_diffs: 0,
            },
          },
          aggregated_ts: {
            seconds: new Long(1650578400),
          },
          transaction_fingerprint_id: new Long(5913510653911377094),
          aggregation_interval: {
            seconds: new Long(3600),
          },
        },
      },
    ],
  },
  error: new RequestError(
    "Forbidden",
    403,
    "this operation requires admin privilege",
  ),
  nodeRegions: {
    "1": "gcp-us-east1",
    "2": "gcp-us-east1",
    "3": "gcp-us-west1",
    "4": "gcp-europe-west1",
  },
};

export const timeScale: TimeScale = {
  windowSize: moment.duration(1, "year"),
  sampleSize: moment.duration(1, "day"),
  fixedWindowEnd: moment.utc("2021.12.31"),
  key: "Custom",
};
