// Copyright 2022 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DOMAIN_NAME } from "../utils";
import {
  ErrorWithKey,
  StatementDetailsRequestWithKey,
  StatementDetailsResponse,
  StatementDetailsResponseWithKey,
} from "src/api/statementsApi";

export type SQLDetailsStatsState = {
  data: StatementDetailsResponse;
  lastError: Error;
  valid: boolean;
  inFlight: boolean;
};

export type SQLDetailsStatsReducerState = {
  cachedData: {
    [id: string]: SQLDetailsStatsState;
  };
};

const initialState: SQLDetailsStatsReducerState = {
  cachedData: {},
};

const sqlDetailsStatsSlice = createSlice({
  name: `${DOMAIN_NAME}/sqlDetailsStats`,
  initialState,
  reducers: {
    received: (
      state,
      action: PayloadAction<StatementDetailsResponseWithKey>,
    ) => {
      state.cachedData[action.payload.key] = {
        data: action.payload.stmtResponse,
        valid: true,
        lastError: null,
        inFlight: false,
      };
    },
    failed: (state, action: PayloadAction<ErrorWithKey>) => {
      state.cachedData[action.payload.key] = {
        data: null,
        valid: false,
        lastError: action.payload.err,
        inFlight: false,
      };
    },
    invalidated: (state, action: PayloadAction<{ key: string }>) => {
      delete state.cachedData[action.payload.key];
    },
    invalidateAll: state => {
      const keys = Object.keys(state);
      for (const key in keys) {
        delete state.cachedData[key];
      }
    },
    refresh: (state, action: PayloadAction<StatementDetailsRequestWithKey>) => {
      state.cachedData[action.payload.key] = {
        data: null,
        valid: false,
        lastError: null,
        inFlight: true,
      };
    },
    request: (state, action: PayloadAction<StatementDetailsRequestWithKey>) => {
      state.cachedData[action.payload.key] = {
        data: null,
        valid: false,
        lastError: null,
        inFlight: true,
      };
    },
  },
});

export const { reducer, actions } = sqlDetailsStatsSlice;
