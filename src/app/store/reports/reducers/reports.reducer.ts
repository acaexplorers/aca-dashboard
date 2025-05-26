import { createReducer, on } from "@ngrx/store";
import * as ReportsActions from "../actions/reports.actions";
import { initialReportsState, ReportsState } from "../reports.state";

export const reportsReducer = createReducer<ReportsState>(
  initialReportsState,

  // Global Reports
  on(ReportsActions.loadGlobalReports, (state, { startDate, endDate }) => ({
    ...state,
    loading: { ...state.loading, global: true },
    error: { ...state.error, global: null },
    selectedDateRange: { startDate, endDate },
  })),
  
  on(ReportsActions.loadGlobalReportsSuccess, (state, { globalReports }) => ({
    ...state,
    globalReports,
    loading: { ...state.loading, global: false },
  })),
  
  on(ReportsActions.loadGlobalReportsFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, global: false },
    error: { ...state.error, global: error },
  })),

  // Weekly Reports
  on(ReportsActions.loadWeeklyReports, (state, { startDate, endDate, username }) => ({
    ...state,
    loading: { ...state.loading, weekly: true },
    error: { ...state.error, weekly: null },
    selectedDateRange: { startDate, endDate },
    selectedUsername: username,
  })),
  
  on(ReportsActions.loadWeeklyReportsSuccess, (state, { weeklyReports }) => ({
    ...state,
    weeklyReports,
    loading: { ...state.loading, weekly: false },
  })),
  
  on(ReportsActions.loadWeeklyReportsFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, weekly: false },
    error: { ...state.error, weekly: error },
  })),

  // Submit Report
  on(ReportsActions.submitUserReport, (state) => ({
    ...state,
    loading: { ...state.loading, submit: true },
    error: { ...state.error, submit: null },
  })),
  
  on(ReportsActions.submitUserReportSuccess, (state, { report }) => ({
    ...state,
    loading: { ...state.loading, submit: false },
  })),
  
  on(ReportsActions.submitUserReportFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, submit: false },
    error: { ...state.error, submit: error },
  })),

  // Clear errors
  on(ReportsActions.clearReportsErrors, (state) => ({
    ...state,
    error: {
      global: null,
      weekly: null,
      submit: null,
    },
  }))
);