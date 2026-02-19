import { JudgeScore } from "@/types";

/**
 * Calculate E-score from judge scores.
 * - 1-3 judges: simple average
 * - 4+ judges: trimmed mean (drop highest and lowest)
 */
export function calculateEScore(eScores: number[]): number {
  if (eScores.length === 0) return 0;

  if (eScores.length <= 3) {
    const sum = eScores.reduce((a, b) => a + b, 0);
    return round3(sum / eScores.length);
  }

  // 4+ judges: drop highest and lowest, average the rest
  const sorted = [...eScores].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  const sum = trimmed.reduce((a, b) => a + b, 0);
  return round3(sum / trimmed.length);
}

/**
 * Calculate final score: D-score + E-score - Neutral Deduction + Bonus
 */
export function calculateFinalScore(
  dScore: number | null,
  eScore: number | null,
  ndScore: number | null,
  bonus?: number | null
): number | null {
  if (dScore === null || eScore === null) return null;
  const nd = ndScore ?? 0;
  const b = bonus ?? 0;
  return round3(dScore + eScore - nd + b);
}

/**
 * Extract E-scores from judge scores array
 */
export function getEScoresFromJudgeScores(judgeScores: JudgeScore[]): number[] {
  return judgeScores
    .filter((js) => js.role.startsWith("E") && js.scoreValue !== null)
    .map((js) => js.scoreValue as number);
}

/**
 * Get D-score (average of D1 and D2, or single D score)
 */
export function getDScoreFromJudgeScores(judgeScores: JudgeScore[]): number | null {
  const dScores = judgeScores
    .filter((js) => js.role.startsWith("D") && js.scoreValue !== null)
    .map((js) => js.scoreValue as number);

  if (dScores.length === 0) return null;
  return round3(dScores.reduce((a, b) => a + b, 0) / dScores.length);
}

/**
 * Get ND score
 */
export function getNDScoreFromJudgeScores(judgeScores: JudgeScore[]): number | null {
  const nd = judgeScores.find((js) => js.role === "ND" && js.scoreValue !== null);
  return nd ? nd.scoreValue : 0;
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
