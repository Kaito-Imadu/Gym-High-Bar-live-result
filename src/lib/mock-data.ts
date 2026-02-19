import {
  Competition,
  Athlete,
  Performance,
  JudgePanel,
  JudgeScore,
  PerformanceWithDetails,
} from "@/types";

export const mockCompetitions: Competition[] = [
  {
    id: "comp-1",
    name: "第1回 Gym High Bar Challenge Cup",
    date: "2026-03-15",
    venue: "大阪市中央体育館",
    status: "in_progress",
  },
  {
    id: "comp-2",
    name: "春季鉄棒選手権大会",
    date: "2026-04-20",
    venue: "東京体育館",
    status: "upcoming",
  },
];

export const mockJudgePanels: JudgePanel[] = [
  { id: "jp-1", competitionId: "comp-1", role: "D1", judgeName: "山田太郎", isChief: true },
  { id: "jp-2", competitionId: "comp-1", role: "D2", judgeName: "鈴木次郎", isChief: false },
  { id: "jp-3", competitionId: "comp-1", role: "E1", judgeName: "佐藤花子", isChief: false },
  { id: "jp-4", competitionId: "comp-1", role: "E2", judgeName: "田中一郎", isChief: false },
  { id: "jp-5", competitionId: "comp-1", role: "E3", judgeName: "高橋美咲", isChief: false },
  { id: "jp-6", competitionId: "comp-1", role: "E4", judgeName: "伊藤健太", isChief: false },
  { id: "jp-7", competitionId: "comp-1", role: "ND", judgeName: "渡辺裕子", isChief: false },
];

export const mockAthletes: Athlete[] = [
  {
    id: "ath-1",
    competitionId: "comp-1",
    name: "橋本 大輝",
    affiliation: "順天堂大学",
    grade: "4年",
    bio: "2024年パリオリンピック金メダリスト",
    startOrder: 1,
  },
  {
    id: "ath-2",
    competitionId: "comp-1",
    name: "萱 和磨",
    affiliation: "セントラルスポーツ",
    grade: "社会人",
    bio: "世界選手権団体金メダル",
    startOrder: 2,
  },
  {
    id: "ath-3",
    competitionId: "comp-1",
    name: "北園 丈琉",
    affiliation: "徳洲会体操クラブ",
    grade: "社会人",
    bio: "東京オリンピック団体銀メダル",
    startOrder: 3,
  },
  {
    id: "ath-4",
    competitionId: "comp-1",
    name: "三輪 哲平",
    affiliation: "日本体育大学",
    grade: "3年",
    bio: "全日本学生選手権優勝",
    startOrder: 4,
  },
  {
    id: "ath-5",
    competitionId: "comp-1",
    name: "杉野 正尭",
    affiliation: "仙台大学",
    grade: "2年",
    bio: "インターハイ鉄棒優勝",
    startOrder: 5,
  },
  {
    id: "ath-6",
    competitionId: "comp-1",
    name: "岡 慎之助",
    affiliation: "徳洲会体操クラブ",
    grade: "社会人",
    bio: "2024年パリオリンピック個人総合金メダリスト",
    startOrder: 6,
  },
];

export const mockPerformances: Performance[] = [
  {
    id: "perf-1",
    competitionId: "comp-1",
    athleteId: "ath-1",
    status: "confirmed",
    dScore: 6.4,
    eScore: 8.533,
    ndScore: 0,
    finalScore: 14.933,
    rank: 1,
    isCurrent: false,
  },
  {
    id: "perf-2",
    competitionId: "comp-1",
    athleteId: "ath-6",
    status: "confirmed",
    dScore: 6.3,
    eScore: 8.4,
    ndScore: 0,
    finalScore: 14.7,
    rank: 2,
    isCurrent: false,
  },
  {
    id: "perf-3",
    competitionId: "comp-1",
    athleteId: "ath-2",
    status: "confirmed",
    dScore: 6.1,
    eScore: 8.367,
    ndScore: 0,
    finalScore: 14.467,
    rank: 3,
    isCurrent: false,
  },
  {
    id: "perf-4",
    competitionId: "comp-1",
    athleteId: "ath-3",
    status: "confirmed",
    dScore: 6.0,
    eScore: 8.2,
    ndScore: 0.1,
    finalScore: 14.1,
    rank: 4,
    isCurrent: false,
  },
  {
    id: "perf-5",
    competitionId: "comp-1",
    athleteId: "ath-4",
    status: "scoring",
    dScore: 5.6,
    eScore: null,
    ndScore: null,
    finalScore: null,
    rank: null,
    isCurrent: true,
  },
  {
    id: "perf-6",
    competitionId: "comp-1",
    athleteId: "ath-5",
    status: "pending",
    dScore: null,
    eScore: null,
    ndScore: null,
    finalScore: null,
    rank: null,
    isCurrent: false,
  },
];

export const mockJudgeScores: JudgeScore[] = [
  // perf-1 scores
  { id: "js-1", performanceId: "perf-1", judgePanelId: "jp-1", role: "D1", scoreValue: 6.4, submittedAt: "2026-03-15T10:05:00Z" },
  { id: "js-2", performanceId: "perf-1", judgePanelId: "jp-2", role: "D2", scoreValue: 6.4, submittedAt: "2026-03-15T10:05:00Z" },
  { id: "js-3", performanceId: "perf-1", judgePanelId: "jp-3", role: "E1", scoreValue: 8.6, submittedAt: "2026-03-15T10:05:00Z" },
  { id: "js-4", performanceId: "perf-1", judgePanelId: "jp-4", role: "E2", scoreValue: 8.5, submittedAt: "2026-03-15T10:05:00Z" },
  { id: "js-5", performanceId: "perf-1", judgePanelId: "jp-5", role: "E3", scoreValue: 8.5, submittedAt: "2026-03-15T10:05:00Z" },
  { id: "js-6", performanceId: "perf-1", judgePanelId: "jp-6", role: "E4", scoreValue: 8.7, submittedAt: "2026-03-15T10:05:00Z" },
  { id: "js-7", performanceId: "perf-1", judgePanelId: "jp-7", role: "ND", scoreValue: 0, submittedAt: "2026-03-15T10:05:00Z" },

  // perf-2 scores
  { id: "js-8", performanceId: "perf-2", judgePanelId: "jp-1", role: "D1", scoreValue: 6.3, submittedAt: "2026-03-15T10:15:00Z" },
  { id: "js-9", performanceId: "perf-2", judgePanelId: "jp-2", role: "D2", scoreValue: 6.3, submittedAt: "2026-03-15T10:15:00Z" },
  { id: "js-10", performanceId: "perf-2", judgePanelId: "jp-3", role: "E1", scoreValue: 8.4, submittedAt: "2026-03-15T10:15:00Z" },
  { id: "js-11", performanceId: "perf-2", judgePanelId: "jp-4", role: "E2", scoreValue: 8.3, submittedAt: "2026-03-15T10:15:00Z" },
  { id: "js-12", performanceId: "perf-2", judgePanelId: "jp-5", role: "E3", scoreValue: 8.5, submittedAt: "2026-03-15T10:15:00Z" },
  { id: "js-13", performanceId: "perf-2", judgePanelId: "jp-6", role: "E4", scoreValue: 8.4, submittedAt: "2026-03-15T10:15:00Z" },
  { id: "js-14", performanceId: "perf-2", judgePanelId: "jp-7", role: "ND", scoreValue: 0, submittedAt: "2026-03-15T10:15:00Z" },

  // perf-3 scores
  { id: "js-15", performanceId: "perf-3", judgePanelId: "jp-1", role: "D1", scoreValue: 6.1, submittedAt: "2026-03-15T10:25:00Z" },
  { id: "js-16", performanceId: "perf-3", judgePanelId: "jp-2", role: "D2", scoreValue: 6.1, submittedAt: "2026-03-15T10:25:00Z" },
  { id: "js-17", performanceId: "perf-3", judgePanelId: "jp-3", role: "E1", scoreValue: 8.4, submittedAt: "2026-03-15T10:25:00Z" },
  { id: "js-18", performanceId: "perf-3", judgePanelId: "jp-4", role: "E2", scoreValue: 8.3, submittedAt: "2026-03-15T10:25:00Z" },
  { id: "js-19", performanceId: "perf-3", judgePanelId: "jp-5", role: "E3", scoreValue: 8.4, submittedAt: "2026-03-15T10:25:00Z" },
  { id: "js-20", performanceId: "perf-3", judgePanelId: "jp-6", role: "E4", scoreValue: 8.5, submittedAt: "2026-03-15T10:25:00Z" },
  { id: "js-21", performanceId: "perf-3", judgePanelId: "jp-7", role: "ND", scoreValue: 0, submittedAt: "2026-03-15T10:25:00Z" },

  // perf-4 scores
  { id: "js-22", performanceId: "perf-4", judgePanelId: "jp-1", role: "D1", scoreValue: 6.0, submittedAt: "2026-03-15T10:35:00Z" },
  { id: "js-23", performanceId: "perf-4", judgePanelId: "jp-2", role: "D2", scoreValue: 6.0, submittedAt: "2026-03-15T10:35:00Z" },
  { id: "js-24", performanceId: "perf-4", judgePanelId: "jp-3", role: "E1", scoreValue: 8.2, submittedAt: "2026-03-15T10:35:00Z" },
  { id: "js-25", performanceId: "perf-4", judgePanelId: "jp-4", role: "E2", scoreValue: 8.1, submittedAt: "2026-03-15T10:35:00Z" },
  { id: "js-26", performanceId: "perf-4", judgePanelId: "jp-5", role: "E3", scoreValue: 8.3, submittedAt: "2026-03-15T10:35:00Z" },
  { id: "js-27", performanceId: "perf-4", judgePanelId: "jp-6", role: "E4", scoreValue: 8.2, submittedAt: "2026-03-15T10:35:00Z" },
  { id: "js-28", performanceId: "perf-4", judgePanelId: "jp-7", role: "ND", scoreValue: 0.1, submittedAt: "2026-03-15T10:35:00Z" },

  // perf-5 partial scores (currently scoring)
  { id: "js-29", performanceId: "perf-5", judgePanelId: "jp-1", role: "D1", scoreValue: 5.6, submittedAt: "2026-03-15T10:45:00Z" },
  { id: "js-30", performanceId: "perf-5", judgePanelId: "jp-2", role: "D2", scoreValue: 5.6, submittedAt: "2026-03-15T10:45:00Z" },
  { id: "js-31", performanceId: "perf-5", judgePanelId: "jp-3", role: "E1", scoreValue: 8.0, submittedAt: "2026-03-15T10:45:00Z" },
  { id: "js-32", performanceId: "perf-5", judgePanelId: "jp-4", role: "E2", scoreValue: null, submittedAt: null },
  { id: "js-33", performanceId: "perf-5", judgePanelId: "jp-5", role: "E3", scoreValue: null, submittedAt: null },
  { id: "js-34", performanceId: "perf-5", judgePanelId: "jp-6", role: "E4", scoreValue: null, submittedAt: null },
  { id: "js-35", performanceId: "perf-5", judgePanelId: "jp-7", role: "ND", scoreValue: null, submittedAt: null },
];

export function getPerformancesWithDetails(competitionId: string): PerformanceWithDetails[] {
  const perfs = mockPerformances.filter((p) => p.competitionId === competitionId);
  return perfs.map((perf) => ({
    ...perf,
    athlete: mockAthletes.find((a) => a.id === perf.athleteId)!,
    judgeScores: mockJudgeScores.filter((js) => js.performanceId === perf.id),
  }));
}

export function getCompetition(id: string): Competition | undefined {
  return mockCompetitions.find((c) => c.id === id);
}

export function getAthletes(competitionId: string): Athlete[] {
  return mockAthletes.filter((a) => a.competitionId === competitionId);
}

export function getJudgePanels(competitionId: string): JudgePanel[] {
  return mockJudgePanels.filter((jp) => jp.competitionId === competitionId);
}
