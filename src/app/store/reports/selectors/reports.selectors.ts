import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReportsState } from '../reports.state';


export const selectReportsState = createFeatureSelector<ReportsState>('reports');

// Global Reports Selectors
export const selectGlobalReports = createSelector(
  selectReportsState,
  (state) => state.globalReports
);
export const selectGlobalReportsLoading = createSelector(
  selectReportsState,
  (state) => state.loadingGlobal
);
export const selectGlobalReportsError = createSelector(
  selectReportsState,
  (state) => state.errorGlobal
);

// Weekly Reports Selectors
export const selectWeeklyReports = createSelector(
  selectReportsState,
  (state) => state.weeklyReports
);
export const selectWeeklyReportsLoading = createSelector(
  selectReportsState,
  (state) => state.loadingWeekly
);
export const selectWeeklyReportsError = createSelector(
  selectReportsState,
  (state) => state.errorWeekly
);

// Submit Report Selectors
export const selectSubmitReportLoading = createSelector(
  selectReportsState,
  (state) => state.loadingSubmit
);
export const selectSubmitReportError = createSelector(
  selectReportsState,
  (state) => state.errorSubmit
);
