import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PointsState } from '../points.state';
import { CombinedStudentData, PointsBreakdown } from 'app/types/points.types';
import { ReportAttributes } from '../../../types/reports.types';

export const selectPointsState = createFeatureSelector<PointsState>('points');

// Basic Selectors
export const selectPointsReports = createSelector(
  selectPointsState,
  (state) => state.reports
);

export const selectPointsStreaks = createSelector(
  selectPointsState,
  (state) => state.streaks
);

export const selectPointsLoading = createSelector(
  selectPointsState,
  (state) => state.loading.loading
);

export const selectPointsError = createSelector(
  selectPointsState,
  (state) => state.error.error
);

export const selectPointsDateRange = createSelector(
  selectPointsState,
  (state) => state.selectedDateRange
);

// Data Selectors
export const selectPointsReportsData = createSelector(
  selectPointsReports,
  (reports) => reports?.data || []
);

export const selectPointsStreaksData = createSelector(
  selectPointsStreaks,
  (streaks) => streaks?.data || []
);

// Combined Data Selector
export const selectCombinedStudentData = createSelector(
  selectPointsReportsData,
  selectPointsStreaksData,
  (reports, streaks): CombinedStudentData[] => {
    // Group reports by username
    const groupedReports = reports.reduce((acc, report) => {
      const username = report.attributes?.legacy_username || 'Unknown User';
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(report.attributes);
      return acc;
    }, {} as Record<string, ReportAttributes[]>);

    // Group streaks by username
    const groupedStreaks = streaks.reduce((acc, streak) => {
      const username = streak.attributes?.legacy_username || 'Unknown User';
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(streak.attributes);
      return acc;
    }, {} as Record<string, any[]>);

    // Combine data for each student
    const allUsernames = new Set([
      ...Object.keys(groupedReports),
      ...Object.keys(groupedStreaks)
    ]);

    return Array.from(allUsernames).map((username) => {
      const userReports = groupedReports[username] || [];
      const userStreaks = groupedStreaks[username] || [];
      
      // Calculate totals from reports
      const totalStudy = userReports.reduce((acc, report) => acc + (report.studied || 0), 0);
      const totalAdded = userReports.reduce((acc, report) => acc + (report.added || 0), 0);
      const studiedDays = userReports.filter(report => (report.studied || 0) > 0).length;
      
      // Get latest streak data (assuming most recent)
      const latestStreak = userStreaks.length > 0 ? userStreaks[userStreaks.length - 1] : null;
      
      const studyRate = studiedDays > 0 ? Math.round((totalStudy / studiedDays) * 100) / 100 : 0;

      return {
        username,
        // From Reports
        totalStudy,
        studiedDays,
        totalAdded,
        dailyReports: userReports,
        // From Streaks
        studyStreak: latestStreak?.study_streak || 0,
        addedStreak: latestStreak?.added_streak || 0,
        activeDaysStreak: latestStreak?.active_days_streak || 0,
        activeStreak: latestStreak?.active_streak || 0,
        // Calculated
        studyRate,
        points: 0, // Will be calculated by points calculation selector
      };
    });
  }
);

// Points Calculation Selector
export const selectStudentsWithPoints = createSelector(
  selectCombinedStudentData,
  (students): CombinedStudentData[] => {
    return students.map(student => {
      const pointsBreakdown = calculatePointsForStudent(student);
      return {
        ...student,
        points: pointsBreakdown.totalPoints,
        pointsBreakdown
      };
    });
  }
);

// Table Data Selector (for table view)
export const selectPointsTableData = createSelector(
  selectStudentsWithPoints,
  (students) => {
    return students.map(student => ({
      student: student.username,
      level: 0, // You might need to get this from another source
      studyRate: student.studyRate,
      daysStudied: student.studiedDays,
      added: student.totalAdded,
      streak: student.studyStreak,
      addedStreak: student.addedStreak,
      activeStreak: student.activeStreak,
      activeDays: student.studiedDays,
      points: student.points,
      totalPoints: student.points, // You might have a running total
      status: 'Active', // You might need to determine this
    }));
  }
);

function calculatePointsForStudent(student: CombinedStudentData): PointsBreakdown {
  // Multiplier (assuming previous week data - you might need to adjust this)
  const multiplier = student.studiedDays >= 6 ? 1.10 : 0.90;
  
  // Study Rate (already calculated)
  const studyRate = student.studyRate;
  
  // Streak bonuses using the formulas from your PDF
  const streakBonus = student.studyStreak > 0 ? 
    Math.round(Math.pow(student.studyStreak, 1.15) * 100) / 100 : 0;
  
  const addedStreakBonus = student.addedStreak > 0 ? 
    Math.round(Math.pow(student.addedStreak, 1.15) * 100) / 100 : 0;
  
  const activeStreakBonus = student.activeStreak > 0 ? 
    Math.round(Math.pow(student.activeStreak * 7, 1.15) * 100) / 100 : 0;
  
  const activeDaysStreakBonus = student.activeDaysStreak > 0 ? 
    Math.round(Math.pow(student.activeDaysStreak, 1.15) * 100) / 100 : 0;

  // Total points calculation
  const totalPoints = Math.round(((multiplier * studyRate) + student.totalAdded + 
    streakBonus + addedStreakBonus + activeStreakBonus + activeDaysStreakBonus) * 100) / 100;

  return {
    multiplier,
    studyRate,
    totalAdded: student.totalAdded,
    streakBonus,
    addedStreakBonus,
    activeStreakBonus,
    activeDaysStreakBonus,
    totalPoints
  };
}