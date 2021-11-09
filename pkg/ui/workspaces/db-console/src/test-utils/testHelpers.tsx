// Copyright 2021 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

// lifted from managed-service

import React, { useState, ReactNode } from "react";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import { StaticRouter, MemoryRouter } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { merge } from "lodash";

import { PartialRecursive } from "src/interfaces/partialRecursive";
// import rootReducer from "./store/reducers";
// import rootReducer from "./store/reducers";

import { reducers, AdminUIState } from "src/redux/state";
import rootSaga from "src/redux/sagas";
// import promiseListener from "./store/promiseListener";

// mockState builds a full copy of app state with preloaded state if desired.
// This utility addresses two important concerns:
//   1) Allow preloaded state to be defined in a type-safe manner, and
//   2) Allow the developer to partially define custom preloaded state such that
//      other child properties at a particular key in the default state are
//      preserved instead of being overwritten. This is important because the
//      default behavior of createStore is to fully overwrite a property at a
//      given key which forces the developer to re-define default state
//      key/values they would otherwise not be concerned with to simply avoid
//      the possibility of test runs breaking for hard-to-debug reasons.
//
//      This behavior is turned on by default but can be overridden by setting
//      the optional mergeState argument to false.  Doing so simply reverts to
//      the standard overwriting behavior of createStore.
export const mockState = (
  preloadedState?: PartialRecursive<AdminUIState>,
  mergeState = true,
): AdminUIState => {
  if (preloadedState && mergeState) {
    // Get default state object.
    const defaultState = createStore(
      reducers,
      {} as Partial<AdminUIState>,
    ).getState();

    // Merge default state with preloaded state and return.
    return merge({}, defaultState, preloadedState);
  }

  // Generate state object with overwritten preloaded state and return.
  return createStore(
    reducers,
    (preloadedState as Partial<AdminUIState>) || {},
  ).getState();
};

export function ProviderWrapperWithState(props: {
  initialState?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  children: ReactNode;
}) {
  const [store] = useState(() => createStore(reducers, props.initialState));

  return (
    <Provider store={store}>
      <StaticRouter context={{}}>{props.children}</StaticRouter>
    </Provider>
  );
}

export function ProviderWrapper(props: {
  // If hookAPIs is true, then the created store adds the rootSaga, which
  // enables hooking API calls (e.g. createCluster/index.test.tsx in managed-service).
  hookAPIs?: boolean;
  initialEntries?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any;
  children: ReactNode;
}) {
  const [store] = React.useState(() => {
    if (props.hookAPIs) {
      const sagaMiddleware = createSagaMiddleware();
      const store = createStore(
        reducers,
        props.initialState || {},
        applyMiddleware(sagaMiddleware),
        // applyMiddleware(sagaMiddleware, promiseListener.middleware),
      );

      sagaMiddleware.run(rootSaga);
      return store;
    }
    return createStore(reducers, props.initialState || {});
  });

  return (
    <Provider store={store}>
      <MemoryRouter keyLength={0} initialEntries={props.initialEntries}>
        {props.children}
      </MemoryRouter>
    </Provider>
  );
}

/* generatorToEquals serializes the expected and actual results before comparing
 * them. When comparing generator values to mgmtCall() without serializing them,
 * the test will fail with "Received: serializes to the same string".
 *
 * I think that it's due to the anonymous fuction that was introduced to make
 * typing mgmtInvoke() possible with TypeScript v3.7 and higher.
 *
 * See: https://github.com/facebook/jest/issues/8475#issuecomment-537830532
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generatorToEquals(expected: any, actual: any) {
  return expect(JSON.stringify(expected)).toEqual(JSON.stringify(actual));
}
