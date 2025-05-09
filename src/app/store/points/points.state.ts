export interface ReportsPoints {
    globalReports: any; // Global reports for all users
    weeklyReports: any[]; // Weekly reports for a specific user
    loadingGlobal: boolean; // Loading points for global reports
    loadingWeekly: boolean; // Loading points for weekly reports
    loadingSubmit: boolean; // Loading points for submitting a report
    errorGlobal: any | null; // Error points for global reports
    errorWeekly: any | null; // Error points for weekly reports
    errorSubmit: any | null; // Error points for submitting a report
  }
  
  export const initialReportsPoints: ReportsPoints = {
    globalReports: {},
    weeklyReports: [],
    loadingGlobal: false,
    loadingWeekly: false,
    loadingSubmit: false,
    errorGlobal: null,
    errorWeekly: null,
    errorSubmit: null,
  };
  