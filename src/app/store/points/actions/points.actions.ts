import { createAction, props } from "@ngrx/store";
import { ReportEntity } from "app/types/reports.types";
import { StreakEntity } from "app/types/points.types";
import { ApiResponse } from "app/utils/types";

// Load Points Data Actions
export const loadPointsData = createAction(
  "[Points] Load Points Data",
  props<{ startDate: string; endDate: string }>()
);

export const loadPointsDataSuccess = createAction(
  "[Points] Load Points Data Success",
  props<{ 
    reports: ApiResponse<ReportEntity[]>; 
    streaks: ApiResponse<StreakEntity[]>; 
  }>()
);

export const loadPointsDataFailure = createAction(
  "[Points] Load Points Data Failure",
  props<{ error: string }>()
);

// Utility Actions
export const clearPointsErrors = createAction(
  "[Points] Clear Errors"
);

export const recalculatePoints = createAction(
  "[Points] Recalculate Points"
);