import {
  Competition,
  Athlete,
  JudgePanel,
  Performance,
  JudgeScore,
  JudgeRole,
  PerformanceWithDetails,
} from "@/types";

// --- Helpers ---
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Competitions ---
const COMP_KEY = "ghb_competitions";

export function getCompetitions(): Competition[] {
  return load<Competition>(COMP_KEY);
}

export function getCompetition(id: string): Competition | undefined {
  return getCompetitions().find((c) => c.id === id);
}

export function createCompetition(data: Omit<Competition, "id">): Competition {
  const comp: Competition = { id: genId(), ...data };
  const all = getCompetitions();
  all.push(comp);
  save(COMP_KEY, all);
  return comp;
}

export function updateCompetition(id: string, data: Partial<Competition>) {
  const all = getCompetitions().map((c) => (c.id === id ? { ...c, ...data } : c));
  save(COMP_KEY, all);
}

export function deleteCompetition(id: string) {
  save(COMP_KEY, getCompetitions().filter((c) => c.id !== id));
  // Clean up related data
  save(ATH_KEY, getAthletes(id).length ? load<Athlete>(ATH_KEY).filter((a) => a.competitionId !== id) : load<Athlete>(ATH_KEY));
  save(JP_KEY, load<JudgePanel>(JP_KEY).filter((j) => j.competitionId !== id));
  save(PERF_KEY, load<Performance>(PERF_KEY).filter((p) => p.competitionId !== id));
  save(JS_KEY, load<JudgeScore>(JS_KEY).filter((js) => {
    const perfs = load<Performance>(PERF_KEY).filter((p) => p.competitionId === id);
    return !perfs.some((p) => p.id === js.performanceId);
  }));
}

// --- Athletes ---
const ATH_KEY = "ghb_athletes";

export function getAthletes(competitionId: string): Athlete[] {
  return load<Athlete>(ATH_KEY)
    .filter((a) => a.competitionId === competitionId)
    .sort((a, b) => a.startOrder - b.startOrder);
}

export function saveAthletes(competitionId: string, athletes: Athlete[]) {
  const others = load<Athlete>(ATH_KEY).filter((a) => a.competitionId !== competitionId);
  save(ATH_KEY, [...others, ...athletes]);
}

export function addAthlete(data: Omit<Athlete, "id">): Athlete {
  const athlete: Athlete = { id: genId(), ...data };
  const all = load<Athlete>(ATH_KEY);
  all.push(athlete);
  save(ATH_KEY, all);
  return athlete;
}

export function removeAthlete(id: string) {
  save(ATH_KEY, load<Athlete>(ATH_KEY).filter((a) => a.id !== id));
  // Remove related performances
  const perfs = load<Performance>(PERF_KEY).filter((p) => p.athleteId === id);
  save(PERF_KEY, load<Performance>(PERF_KEY).filter((p) => p.athleteId !== id));
  const perfIds = perfs.map((p) => p.id);
  save(JS_KEY, load<JudgeScore>(JS_KEY).filter((js) => !perfIds.includes(js.performanceId)));
}

// --- Judge Panels ---
const JP_KEY = "ghb_judge_panels";

export function getJudgePanels(competitionId: string): JudgePanel[] {
  return load<JudgePanel>(JP_KEY).filter((j) => j.competitionId === competitionId);
}

export function saveJudgePanels(competitionId: string, panels: JudgePanel[]) {
  const others = load<JudgePanel>(JP_KEY).filter((j) => j.competitionId !== competitionId);
  save(JP_KEY, [...others, ...panels]);
}

// --- Performances ---
const PERF_KEY = "ghb_performances";

export function getPerformances(competitionId: string): Performance[] {
  return load<Performance>(PERF_KEY).filter((p) => p.competitionId === competitionId);
}

export function getPerformance(id: string): Performance | undefined {
  return load<Performance>(PERF_KEY).find((p) => p.id === id);
}

export function initPerformances(competitionId: string) {
  // Create a performance entry for each athlete if not exists
  const athletes = getAthletes(competitionId);
  const existing = getPerformances(competitionId);
  const existingAthleteIds = existing.map((p) => p.athleteId);
  const newPerfs: Performance[] = athletes
    .filter((a) => !existingAthleteIds.includes(a.id))
    .map((a) => ({
      id: genId(),
      competitionId,
      athleteId: a.id,
      status: "pending" as const,
      dScore: null,
      eScore: null,
      ndScore: null,
      bonus: null,
      finalScore: null,
      rank: null,
      isCurrent: false,
    }));
  if (newPerfs.length > 0) {
    const all = load<Performance>(PERF_KEY);
    save(PERF_KEY, [...all, ...newPerfs]);
  }
}

export function updatePerformance(id: string, data: Partial<Performance>) {
  const all = load<Performance>(PERF_KEY).map((p) => (p.id === id ? { ...p, ...data } : p));
  save(PERF_KEY, all);
}

export function setCurrentPerformance(competitionId: string, perfId: string) {
  const all = load<Performance>(PERF_KEY).map((p) => {
    if (p.competitionId !== competitionId) return p;
    return { ...p, isCurrent: p.id === perfId, status: p.id === perfId ? "scoring" as const : p.status };
  });
  save(PERF_KEY, all);
}

export function clearCurrentPerformance(competitionId: string) {
  const all = load<Performance>(PERF_KEY).map((p) => {
    if (p.competitionId !== competitionId) return p;
    return { ...p, isCurrent: false };
  });
  save(PERF_KEY, all);
}

export function confirmPerformance(
  perfId: string,
  dScore: number,
  eScore: number,
  ndScore: number,
  finalScore: number,
  bonus?: number
) {
  const all = load<Performance>(PERF_KEY).map((p) =>
    p.id === perfId
      ? { ...p, status: "confirmed" as const, isCurrent: false, dScore, eScore, ndScore, bonus: bonus ?? 0, finalScore }
      : p
  );
  save(PERF_KEY, all);
}

export function recalcRanks(competitionId: string) {
  const all = load<Performance>(PERF_KEY);
  const confirmed = all
    .filter((p) => p.competitionId === competitionId && p.status === "confirmed" && p.finalScore !== null)
    .sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));

  confirmed.forEach((p, i) => {
    p.rank = i + 1;
  });

  // Reset rank for non-confirmed
  const updated = all.map((p) => {
    if (p.competitionId !== competitionId) return p;
    const ranked = confirmed.find((c) => c.id === p.id);
    if (ranked) return ranked;
    return { ...p, rank: null };
  });
  save(PERF_KEY, updated);
}

// --- Judge Scores ---
const JS_KEY = "ghb_judge_scores";

export function getJudgeScores(performanceId: string): JudgeScore[] {
  return load<JudgeScore>(JS_KEY).filter((js) => js.performanceId === performanceId);
}

export function submitJudgeScore(performanceId: string, judgePanelId: string, role: JudgeRole, scoreValue: number) {
  const all = load<JudgeScore>(JS_KEY);
  const existing = all.findIndex((js) => js.performanceId === performanceId && js.judgePanelId === judgePanelId);
  const entry: JudgeScore = {
    id: existing >= 0 ? all[existing].id : genId(),
    performanceId,
    judgePanelId,
    role,
    scoreValue,
    submittedAt: new Date().toISOString(),
  };
  if (existing >= 0) {
    all[existing] = entry;
  } else {
    all.push(entry);
  }
  save(JS_KEY, all);
}

// --- Scoreboard display control ---
const SB_KEY = "ghb_scoreboard_display";

export type ScoreboardMode = "auto" | "performance" | "ranking";

interface ScoreboardDisplay {
  competitionId: string;
  mode: ScoreboardMode;
  performanceId?: string;
}

export function setScoreboardDisplay(competitionId: string, mode: ScoreboardMode, performanceId?: string) {
  if (typeof window === "undefined") return;
  const data: ScoreboardDisplay = { competitionId, mode, performanceId };
  localStorage.setItem(SB_KEY, JSON.stringify(data));
}

export function getScoreboardDisplay(competitionId: string): ScoreboardDisplay {
  if (typeof window === "undefined") return { competitionId, mode: "auto" };
  try {
    const raw = localStorage.getItem(SB_KEY);
    if (raw) {
      const data = JSON.parse(raw) as ScoreboardDisplay;
      if (data.competitionId === competitionId) return data;
    }
  } catch {}
  return { competitionId, mode: "auto" };
}

// --- Combined queries ---

export function getPerformancesWithDetails(competitionId: string): PerformanceWithDetails[] {
  const perfs = getPerformances(competitionId);
  const athletes = getAthletes(competitionId);
  return perfs
    .map((perf) => {
      const athlete = athletes.find((a) => a.id === perf.athleteId);
      if (!athlete) return null;
      return {
        ...perf,
        athlete,
        judgeScores: getJudgeScores(perf.id),
      };
    })
    .filter((p): p is PerformanceWithDetails => p !== null);
}
