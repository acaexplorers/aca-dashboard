import { createAction, props } from "@ngrx/store";
import { ReportAttributes, ReportEntity } from "app/types/reports.types";
import { ApiResponse } from "app/utils/types";

// Global Reports Actions
export const loadGlobalReports = createAction(
  "[Reports] Load Global Reports",
  props<{ startDate: string; endDate: string }>()
);

export const loadGlobalReportsSuccess = createAction(
  "[Reports] Load Global Reports Success",
  props<{ globalReports: ApiResponse<ReportEntity[]> }>()
);

export const loadGlobalReportsFailure = createAction(
  "[Reports] Load Global Reports Failure",
  props<{ error: string }>()
);

// Weekly Reports Actions
export const loadWeeklyReports = createAction(
  "[Reports] Load Weekly Reports",
  props<{ startDate: string; endDate: string; username: string }>()
);

export const loadWeeklyReportsSuccess = createAction(
  "[Reports] Load Weekly Reports Success",
  props<{ weeklyReports: ReportEntity[] }>()
);

export const loadWeeklyReportsFailure = createAction(
  "[Reports] Load Weekly Reports Failure",
  props<{ error: string }>()
);

// Submit Report Actions
export const submitUserReport = createAction(
  "[Reports] Submit User Report",
  props<{ report: Partial<ReportAttributes> }>()
);

export const submitUserReportSuccess = createAction(
  "[Reports] Submit User Report Success",
  props<{ report: ReportEntity }>()
);

export const submitUserReportFailure = createAction(
  "[Reports] Submit User Report Failure",
  props<{ error: string }>()
);

// Utility Actions
export const clearReportsErrors = createAction(
  "[Reports] Clear Errors"
);