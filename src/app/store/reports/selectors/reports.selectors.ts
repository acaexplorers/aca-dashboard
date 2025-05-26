import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReportsState } from '../reports.state';
import { GroupedReports, StudentSummary, TableStudent } from '../../../types/reports.types';

export const selectReportsState = createFeatureSelector<ReportsState>('reports');

// Basic Selectors
export const selectGlobalReports = createSelector(
  selectReportsState,
  (state) => state.globalReports
);

export const selectWeeklyReports = createSelector(
  selectReportsState,
  (state) => state.weeklyReports
);

export const selectReportsLoading = createSelector(
  selectReportsState,
  (state) => state.loading
);

export const selectReportsError = createSelector(
  selectReportsState,
  (state) => state.error
);

export const selectSelectedDateRange = createSelector(
  selectReportsState,
  (state) => state.selectedDateRange
);

// Computed Selectors
export const selectGlobalReportsData = createSelector(
  selectGlobalReports,
  (reports) => reports?.data || []
);

export const selectGroupedGlobalReports = createSelector(
  selectGlobalReportsData,
  (reports): GroupedReports => {
    return reports.reduce((acc, report) => {
      const username = report.attributes?.legacy_username || 'Unknown User';
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(report.attributes);
      return acc;
    }, {} as GroupedReports);
  }
);

export const selectStudentSummaries = createSelector(
  selectGroupedGlobalReports,
  (groupedReports): StudentSummary[] => {
    return Object.keys(groupedReports).map((username) => {
      const userReports = groupedReports[username];
      const totalStudied = userReports.reduce((acc, day) => acc + (day.studied || 0), 0);
      const totalAdded = userReports.reduce((acc, day) => acc + (day.added || 0), 0);

      const daysWithAdditionalFields = userReports.map((day) => ({
        ...day,
        day: getDayFromDate(day.day_reported),
        addedOn: getDayFromDate(day.creation),
      }));

      return {
        name: username,
        totalStudied,
        totalAdded,
        days: daysWithAdditionalFields,
      };
    });
  }
);

export const selectTableStudents = createSelector(
  selectGroupedGlobalReports,
  (groupedReports): TableStudent[] => {
    const allRows: TableStudent[] = [];
    Object.keys(groupedReports).forEach((username) => {
      groupedReports[username].forEach((day) => {
        allRows.push({
          name: username,
          day: day.day_reported,
          studied: day.studied || 0,
          added: day.added || 0,
          level: day.level || 'N/A',
          addedOn: day.day_reported,
        });
      });
    });
    return allRows;
  }
);

// Loading selectors
export const selectIsGlobalLoading = createSelector(
  selectReportsLoading,
  (loading) => loading.global
);

export const selectIsWeeklyLoading = createSelector(
  selectReportsLoading,
  (loading) => loading.weekly
);

export const selectIsSubmitLoading = createSelector(
  selectReportsLoading,
  (loading) => loading.submit
);

// Error selectors
export const selectGlobalError = createSelector(
  selectReportsError,
  (error) => error.global
);

export const selectWeeklyError = createSelector(
  selectReportsError,
  (error) => error.weekly
);

export const selectSubmitError = createSelector(
  selectReportsError,
  (error) => error.submit
);


// Submit report status selector
export const selectSubmitReportStatus = createSelector(
  selectIsSubmitLoading,
  selectSubmitError,
  (loading, error) => ({ loading, error })
);