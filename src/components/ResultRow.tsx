"use client";

import { PerformanceWithDetails } from "@/types";
import { Trophy, ChevronDown, ChevronUp, Clock, Loader2 } from "lucide-react";

interface ResultRowProps {
  performance: PerformanceWithDetails;
  isExpanded: boolean;
  onToggle: () => void;
}

function getRankDisplay(rank: number | null, status: string) {
  if (status === "pending") return <Clock className="w-4 h-4 text-navy-400" />;
  if (status === "scoring") return <Loader2 className="w-4 h-4 text-accent animate-spin" />;
  if (rank === null) return "-";
  return rank;
}

function getMedalColor(rank: number | null): string {
  if (rank === 1) return "text-gold";
  if (rank === 2) return "text-silver";
  if (rank === 3) return "text-bronze";
  return "text-navy-600";
}

export default function ResultRow({ performance, isExpanded, onToggle }: ResultRowProps) {
  const { athlete, status, dScore, eScore, ndScore, finalScore, rank, judgeScores } = performance;
  const isCurrent = performance.isCurrent;

  return (
    <div
      className={`border-b border-navy-200 transition-colors ${
        isCurrent ? "bg-accent/5 border-l-4 border-l-accent" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-3 py-3 flex items-center gap-2 text-left hover:bg-navy-100/50 transition-colors"
      >
        {/* Rank */}
        <div className={`w-8 text-center font-bold text-lg ${getMedalColor(rank)}`}>
          {rank !== null && rank <= 3 && status === "confirmed" ? (
            <Trophy className={`w-5 h-5 mx-auto ${getMedalColor(rank)}`} />
          ) : (
            getRankDisplay(rank, status)
          )}
        </div>

        {/* Athlete info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm sm:text-base truncate">{athlete.name}</div>
          <div className="text-xs text-navy-500 truncate">{athlete.affiliation}</div>
        </div>

        {/* Score */}
        <div className="text-right">
          {finalScore !== null ? (
            <div className="font-mono text-lg sm:text-xl font-bold text-navy-900">
              {finalScore.toFixed(3)}
            </div>
          ) : status === "scoring" ? (
            <div className="text-sm text-accent font-medium">採点中...</div>
          ) : (
            <div className="text-sm text-navy-400">-</div>
          )}
        </div>

        {/* Expand */}
        <div className="w-6 text-navy-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion detail */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 bg-navy-50/50">
          <div className="grid grid-cols-3 gap-3 text-center mb-3">
            <div>
              <div className="text-xs text-navy-500 mb-1">Dスコア</div>
              <div className="font-mono text-base font-semibold">
                {dScore !== null ? dScore.toFixed(1) : "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-navy-500 mb-1">Eスコア</div>
              <div className="font-mono text-base font-semibold">
                {eScore !== null ? eScore.toFixed(3) : "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-navy-500 mb-1">ND</div>
              <div className="font-mono text-base font-semibold text-red-600">
                {ndScore !== null && ndScore > 0 ? `-${ndScore.toFixed(1)}` : ndScore !== null ? "0.0" : "-"}
              </div>
            </div>
          </div>

          {/* Judge score details */}
          {judgeScores.length > 0 && status !== "pending" && (
            <div className="border-t border-navy-200 pt-2">
              <div className="text-xs text-navy-500 mb-2">審判スコア詳細</div>
              <div className="flex flex-wrap gap-2">
                {judgeScores.map((js) => (
                  <div
                    key={js.id}
                    className="bg-white rounded px-2 py-1 text-xs border border-navy-200"
                  >
                    <span className="text-navy-500 font-medium">{js.role}:</span>{" "}
                    <span className="font-mono font-semibold">
                      {js.scoreValue !== null ? js.scoreValue.toFixed(1) : "..."}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Athlete bio */}
          {athlete.bio && (
            <div className="mt-2 text-xs text-navy-500">
              {athlete.grade} / {athlete.bio}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
