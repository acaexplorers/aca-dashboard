export interface ReportsState {
    globalReports: any; // Global reports for all users
    weeklyReports: any[]; // Weekly reports for a specific user
    loadingGlobal: boolean; // Loading state for global reports
    loadingWeekly: boolean; // Loading state for weekly reports
    loadingSubmit: boolean; // Loading state for submitting a report
    errorGlobal: any | null; // Error state for global reports
    errorWeekly: any | null; // Error state for weekly reports
    errorSubmit: any | null; // Error state for submitting a report
  }
  
  export const initialReportsState: ReportsState = {
    globalReports: {},
    weeklyReports: [],
    loadingGlobal: false,
    loadingWeekly: false,
    loadingSubmit: false,
    errorGlobal: null,
    errorWeekly: null,
    errorSubmit: null,
  };
  