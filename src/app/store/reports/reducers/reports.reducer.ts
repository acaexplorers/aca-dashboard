import { createReducer, on } from "@ngrx/store";
import * as ReportsActions from "app/store/reports/actions/reports.actions";
import { initialReportsState } from "../reports.state";

export const reportsReducer = createReducer(
  initialReportsState,

  // Global Reports
  on(ReportsActions.loadGlobalReports, (state) => ({
    ...state,
    loadingGlobal: true,
    errorGlobal: null,
  })),
  on(ReportsActions.loadGlobalReportsSuccess, (state, { globalReports }) => ({
    ...state,
    globalReports,
    loadingGlobal: false,
  })),
  on(ReportsActions.loadGlobalReportsFailure, (state, { error }) => ({
    ...state,
    loadingGlobal: false,
    errorGlobal: error,
  })),

  // Weekly Reports
  on(ReportsActions.loadWeeklyReports, (state) => ({
    ...state,
    loadingWeekly: true,
    errorWeekly: null,
  })),
  on(ReportsActions.loadWeeklyReportsSuccess, (state, { weeklyReports }) => ({
    ...state,
    weeklyReports,
    loadingWeekly: false,
  })),
  on(ReportsActions.loadWeeklyReportsFailure, (state, { error }) => ({
    ...state,
    loadingWeekly: false,
    errorWeekly: error,
  })),

  // Submit Report
  on(ReportsActions.submitUserReport, (state) => ({
    ...state,
    loadingSubmit: true,
    errorSubmit: null,
  })),
  on(ReportsActions.submitUserReportSuccess, (state, { report }) => ({
    ...state,
    //globalReports: [...state.globalReports, report],
    loadingSubmit: false,
  })),
  on(ReportsActions.submitUserReportFailure, (state, { error }) => ({
    ...state,
    loadingSubmit: false,
    errorSubmit: error,
  }))
);
