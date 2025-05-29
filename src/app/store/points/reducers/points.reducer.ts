import { createReducer, on } from "@ngrx/store";
import * as PointsActions from "../actions/points.actions";
import { initialPointsState, PointsState } from "../points.state";

export const pointsReducer = createReducer<PointsState>(
  initialPointsState,

  // Load Points Data
  on(PointsActions.loadPointsData, (state, { startDate, endDate }) => ({
    ...state,
    loading: { loading: true },
    error: { error: null },
    selectedDateRange: { startDate, endDate },
  })),

  on(PointsActions.loadPointsDataSuccess, (state, { reports, streaks }) => ({
    ...state,
    reports,
    streaks,
    loading: { loading: false },
  })),

  on(PointsActions.loadPointsDataFailure, (state, { error }) => ({
    ...state,
    loading: { loading: false },
    error: { error },
  })),

  // Clear errors
  on(PointsActions.clearPointsErrors, (state) => ({
    ...state,
    error: { error: null },
  })),

  // Recalculate points (just triggers selectors to recompute)
  on(PointsActions.recalculatePoints, (state) => ({
    ...state,
    // Trigger recalculation by updating state slightly
    selectedDateRange: { ...state.selectedDateRange },
  }))
);
