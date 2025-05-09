import { createAction, props } from "@ngrx/store";

export const loadGlobalReports = createAction(
  "[Reports] Load Global Reports",
  props<{ startDate: string; endDate: string }>()
);
console.log("Disparando Reports acción loadGlobalReports");

export const loadGlobalReportsSuccess = createAction(
  "[Reports] Load Global Reports Success",
  props<{ globalReports: any[] }>()
);

export const loadGlobalReportsFailure = createAction(
  "[Reports] Load Global Reports Failure",
  props<{ error: any }>()
);

export const loadWeeklyReports = createAction(
  "[Reports] Load Weekly Reports",
  props<{ startDate: string; endDate: string; username: string }>()
);

export const loadWeeklyReportsSuccess = createAction(
  "[Reports] Load Weekly Reports Success",
  props<{ weeklyReports: any[] }>()
);

export const loadWeeklyReportsFailure = createAction(
  "[Reports] Load Weekly Reports Failure",
  props<{ error: any }>()
);

// Submit Report Actions
export const submitUserReport = createAction(
  "[Reports] Submit User Report",
  props<{ report: any }>()
);

export const submitUserReportSuccess = createAction(
  "[Reports] Submit User Report Success",
  props<{ report: any }>()
);

export const submitUserReportFailure = createAction(
  "[Reports] Submit User Report Failure",
  props<{ error: any }>()
);
