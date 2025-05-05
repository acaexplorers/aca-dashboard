import { createReducer, on } from "@ngrx/store";
import * as PointsActions  from "../actions/points.action";
import { initialReportsPoints } from "../points.state";


export const pointsReducer = createReducer(
  initialReportsPoints,

  // Global Reports
  on(PointsActions.loadPointsData, (state) => ({
    ...state,
    loadingGlobal: true,
    errorGlobal: null,
  })),
    on(PointsActions.loadPointsDataSuccess, (state, { globalReports }) => ({
      ...state,
      globalReports,
      loadingGlobal: false,
    })),
    on(PointsActions.loadPointsDataFailure, (state, { error }) => ({
      ...state,
      loadingGlobal: false,
      errorGlobal: error,
    })),

);