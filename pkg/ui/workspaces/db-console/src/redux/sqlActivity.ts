import { Action } from "redux";
import _ from "lodash";
import { statementDetailsReducerObj } from "src/redux/apiReducers";
import { PayloadAction } from "oss/src/interfaces/action";
import {
  CANCEL_STATEMENT_DIAGNOSTICS_REPORT,
  CancelStatementDiagnosticsReportPayload,
} from "oss/src/redux/statements";
import { WithID } from "oss/src/redux/metrics";

/**
 * SqlActivityState maintains a MetricQuerySet collection, along with some
 * metadata relevant to server queries.
 */
export class SqlActivityState {
  //
  statementDetailsLatestFormattedQuery: string;
  statementDetailsLatestQuery: string;
}

const SET_STATEMENT_DETAILS_LATEST_FORMATTED_QUERY =
  "cockroachui/sqlActivity/SET_STATEMENT_DETAILS_LATEST_FORMATTED_QUERY";
const SET_STATEMENT_DETAILS_LATEST_QUERY =
  "cockroachui/sqlActivity/SET_STATEMENT_DETAILS_LATEST_QUERY";

export function statementDetailsLatestFormattedQueryAction(
  formattedQuery: string,
): PayloadAction<string> {
  return {
    type: SET_STATEMENT_DETAILS_LATEST_FORMATTED_QUERY,
    payload: formattedQuery,
  };
}

// export const setStatementDetailsLatestFormattedQuery = (formattedQuery: string) => {
//     dispatch(
//       localStorageActions.update({
//         key: "showColumns/ActiveStatementsPage",
//         value: formatedQuery,
//       }),
//     );
// }

/**
 * The metrics reducer accepts events for individual MetricQuery objects,
 * dispatching them based on ID. It also accepts actions which indicate the
 * state of the connection to the server.
 */
export function sqlActivityReducer(
  state: SqlActivityState = new SqlActivityState(),
  action: Action,
): SqlActivityState {
  switch (action.type) {
    case SET_STATEMENT_DETAILS_LATEST_FORMATTED_QUERY: {
      const { payload: formattedQuery } = action as PayloadAction<string>;
      state = _.clone(state);
      state.statementDetailsLatestFormattedQuery = formattedQuery;
      return state;
    }
    default:
      return state;
  }
}
