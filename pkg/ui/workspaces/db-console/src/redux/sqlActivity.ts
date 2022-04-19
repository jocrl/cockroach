import { Action } from "redux";
import _ from "lodash";
import { PayloadAction } from "oss/src/interfaces/action";

/**
 * SqlActivityState maintains a MetricQuerySet collection, along with some
 * metadata relevant to server queries.
 */
export class SqlActivityState {
  // Used to remember the statement text for the current details page, even if the time frame is changed such that the statements is no longer found in the time frame and thus `this.props.statement` is null
  statementDetailsLatestQuery: string;
  statementDetailsLatestFormattedQuery: string;
}

const SET_STATEMENT_DETAILS_LATEST_QUERY =
  "cockroachui/sqlActivity/SET_STATEMENT_DETAILS_LATEST_QUERY";
const SET_STATEMENT_DETAILS_LATEST_FORMATTED_QUERY =
  "cockroachui/sqlActivity/SET_STATEMENT_DETAILS_LATEST_FORMATTED_QUERY";

export function statementDetailsLatestQueryAction(
  query: string,
): PayloadAction<string> {
  return {
    type: SET_STATEMENT_DETAILS_LATEST_QUERY,
    payload: query,
  };
}
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
    case SET_STATEMENT_DETAILS_LATEST_QUERY: {
      const { payload: query } = action as PayloadAction<string>;
      state = _.clone(state);
      state.statementDetailsLatestQuery = query;
      return state;
    }
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
