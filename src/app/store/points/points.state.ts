import { ReportEntity } from "app/types/reports.types";
import {
  StreakEntity,
  PointsLoadingState,
  PointsErrorState,
} from "app/types/points.types";
import { ApiResponse } from "app/utils/types";

export interface PointsState {
  // Raw Data
  reports: ApiResponse<ReportEntity[]> | null;
  streaks: ApiResponse<StreakEntity[]> | null;

  // UI State
  loading: PointsLoadingState;
  error: PointsErrorState;

  // Metadata
  selectedDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

export const initialPointsState: PointsState = {
  reports: null,
  streaks: null,
  loading: {
    loading: false,
  },
  error: {
    error: null,
  },
  selectedDateRange: {
    startDate: null,
    endDate: null,
  },
};
