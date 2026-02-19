export type CompetitionStatus = "upcoming" | "in_progress" | "completed";
export type PerformanceStatus = "pending" | "scoring" | "confirmed";
export type JudgeRole = "D1" | "D2" | "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "ND";

export interface Competition {
  id: string;
  name: string;
  date: string;
  venue: string;
  status: CompetitionStatus;
}

export interface JudgePanel {
  id: string;
  competitionId: string;
  role: JudgeRole;
  judgeName: string;
  isChief: boolean;
}

export interface Athlete {
  id: string;
  competitionId: string;
  name: string;
  affiliation: string;
  grade: string;
  bio: string;
  startOrder: number;
}

export interface Performance {
  id: string;
  competitionId: string;
  athleteId: string;
  status: PerformanceStatus;
  dScore: number | null;
  eScore: number | null;
  ndScore: number | null;
  finalScore: number | null;
  rank: number | null;
  isCurrent: boolean;
}

export interface JudgeScore {
  id: string;
  performanceId: string;
  judgePanelId: string;
  role: JudgeRole;
  scoreValue: number | null;
  submittedAt: string | null;
}

export interface PerformanceWithDetails extends Performance {
  athlete: Athlete;
  judgeScores: JudgeScore[];
}
