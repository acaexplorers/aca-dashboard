import {
  ReportEntity,
  LoadingState,
  ErrorState,
} from "app/types/reports.types";
import { ApiResponse } from "app/utils/types";

export interface ReportsState {
  // Data
  globalReports: ApiResponse<ReportEntity[]> | null;
  weeklyReports: ReportEntity[];

  // UI State
  loading: LoadingState;
  error: ErrorState;

  // Metadata
  selectedDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedUsername: string | null;
}

export const initialReportsState: ReportsState = {
  globalReports: null,
  weeklyReports: [],
  loading: {
    global: false,
    weekly: false,
    submit: false,
  },
  error: {
    global: null,
    weekly: null,
    submit: null,
  },
  selectedDateRange: {
    startDate: null,
    endDate: null,
  },
  selectedUsername: null,
};
