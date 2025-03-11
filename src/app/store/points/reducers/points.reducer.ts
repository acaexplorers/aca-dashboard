import { createReducer, on } from "@ngrx/store";
import { loadPointsData, loadPointsDataSuccess, loadPointsDataFailure } from "app/store/points/actions/points.action";

export interface PointsState {
  data: any[];
  isLoading: boolean;
  error: any;
}

export const initialState: PointsState = {
  data: [],
  isLoading: false,
  error: null,
};

export const pointsReducer = createReducer(
  initialState,
  on(loadPointsData, (state) => ({ ...state, isLoading: true, error: null })),
  on(loadPointsDataSuccess, (state, { data }) => ({ ...state, data, isLoading: false })),
  on(loadPointsDataFailure, (state, { error }) => ({ ...state, error, isLoading: false }))
);