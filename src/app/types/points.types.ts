import { ReportAttributes } from "./reports.types";

export interface StudentData {
  student: string;
  level: number;
  habitAction: number;
  points: number;
  totalPoints: number;
  contributed: string;
  added: number;
  status: string;
  studyRate: number;
  daysStudied: number;
  streak: number;
  studied: number;
  max: number;
  maxLevel: number;
  activeDays: number;
  addedStreak: number;
  activeStreak: number;
  activeDaysStreak: string;
}

export interface StreakAttributes {
  legacy_username: string;
  week_start_date: string;
  week_end_date: string;
  study_streak: number;
  added_streak: number;
  active_days_streak: number;
  active_streak: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface StreakEntity {
  id: number;
  attributes: StreakAttributes;
}

export interface CombinedStudentData {
  username: string;
  // From Reports
  totalStudy: number;
  studiedDays: number;
  totalAdded: number;
  dailyReports: ReportAttributes[];
  // From Streaks
  studyStreak: number;
  addedStreak: number;
  activeDaysStreak: number;
  activeStreak: number;
  // Calculated
  studyRate: number;
  points: number;
  pointsBreakdown?: PointsBreakdown;
}

export interface PointsBreakdown {
  multiplier: number;
  studyRate: number;
  totalAdded: number;
  streakBonus: number;
  addedStreakBonus: number;
  activeStreakBonus: number;
  activeDaysStreakBonus: number;
  totalPoints: number;
}

export interface PointsLoadingState {
  loading: boolean;
}

export interface PointsErrorState {
  error: string | null;
}