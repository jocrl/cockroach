import { Action } from "redux";
import _ from "lodash";
import { statementDetailsReducerObj } from "oss/src/redux/apiReducers";

/**
 * SqlActivityState maintains a MetricQuerySet collection, along with some
 * metadata relevant to server queries.
 */
export class SqlActivityState {
  //
  statementDetailsIsLoading: boolean;
}

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
    // fixme
    case statementDetailsReducerObj.cachedDataReducer.REQUEST:
      state = _.clone(state);
      state.statementDetailsIsLoading = true;
      return state;

    // fixme
    case this.cachedDataReducer.RECEIVE:
    case this.cachedDataReducer.ERROR:
      state = _.clone(state);
      state.statementDetailsIsLoading = false;
      return state;

    // Other actions may be handled by the metricsQueryReducer.
    default:
      return state;
  }
}
