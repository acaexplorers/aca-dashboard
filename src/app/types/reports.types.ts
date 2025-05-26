export interface ReportAttributes {
  legacy_username: string;
  day_reported: string;
  creation: string;
  studied: number;
  added: number;
  level?: string;
  day?: string;
  addedOn?: string;
}

export interface ReportEntity {
  id: string;
  attributes: ReportAttributes;
}

export interface GroupedReports {
  [username: string]: ReportAttributes[];
}

export interface StudentSummary {
  name: string;
  totalStudied: number;
  totalAdded: number;
  days: ReportAttributes[];
}

export interface TableStudent {
  name: string;
  day: string;
  studied: number;
  added: number;
  level: string;
  addedOn: string;
}

export interface LoadingState {
  global: boolean;
  weekly: boolean;
  submit: boolean;
}

export interface ErrorState {
  global: string | null;
  weekly: string | null;
  submit: string | null;
}
