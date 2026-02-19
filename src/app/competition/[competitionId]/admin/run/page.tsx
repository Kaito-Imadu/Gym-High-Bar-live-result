"use client";

import { use, useState } from "react";
import { getPerformancesWithDetails, getCompetition } from "@/lib/mock-data";
import { PerformanceWithDetails } from "@/types";
import { Play, CheckCircle, Clock, Loader2, SkipForward } from "lucide-react";
import LiveBadge from "@/components/LiveBadge";

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "scoring":
      return <Loader2 className="w-5 h-5 text-accent animate-spin" />;
    default:
      return <Clock className="w-5 h-5 text-navy-400" />;
  }
}

const statusLabels: Record<string, string> = {
  pending: "待機中",
  scoring: "採点中",
  confirmed: "確定",
};

export default function RunPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const competition = getCompetition(competitionId);
  const initialPerfs = getPerformancesWithDetails(competitionId);
  const [performances, setPerformances] = useState<PerformanceWithDetails[]>(initialPerfs);

  const sortedByOrder = [...performances].sort(
    (a, b) => a.athlete.startOrder - b.athlete.startOrder
  );

  const currentPerf = performances.find((p) => p.isCurrent);

  const handleStartScoring = (perfId: string) => {
    setPerformances((prev) =>
      prev.map((p) => ({
        ...p,
        isCurrent: p.id === perfId,
        status: p.id === perfId ? "scoring" as const : p.status,
      }))
    );
  };

  const handleConfirm = (perfId: string) => {
    setPerformances((prev) => {
      const updated = prev.map((p) =>
        p.id === perfId
          ? { ...p, status: "confirmed" as const, isCurrent: false, finalScore: 13.5, dScore: 5.5, eScore: 8.1, ndScore: 0.1, rank: null }
          : p
      );
      // Recalculate ranks for confirmed
      const confirmed = updated
        .filter((p) => p.status === "confirmed" && p.finalScore !== null)
        .sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));
      confirmed.forEach((p, i) => {
        p.rank = i + 1;
      });
      return updated;
    });
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy-900">競技進行管理</h1>
        {competition?.status === "in_progress" && <LiveBadge />}
      </div>

      {/* Current performer highlight */}
      {currentPerf && (
        <div className="bg-accent/5 border-2 border-accent rounded-xl p-4 mb-6">
          <div className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
            現在の演技者
          </div>
          <div className="text-lg font-bold text-navy-900">
            {currentPerf.athlete.name}
          </div>
          <div className="text-sm text-navy-500 mb-3">
            {currentPerf.athlete.affiliation}
          </div>
          <button
            onClick={() => handleConfirm(currentPerf.id)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            スコア確定
          </button>
        </div>
      )}

      {/* Performance list */}
      <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
        <div className="px-4 py-2 bg-navy-100">
          <h3 className="text-sm font-medium text-navy-700">演技順</h3>
        </div>
        {sortedByOrder.map((perf) => (
          <div
            key={perf.id}
            className={`flex items-center gap-3 px-4 py-3 border-b border-navy-100 last:border-b-0 ${
              perf.isCurrent ? "bg-accent/5" : ""
            }`}
          >
            <div className="w-6 text-center text-sm font-mono text-navy-500">
              {perf.athlete.startOrder}
            </div>
            <StatusIcon status={perf.status} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-navy-900 truncate">{perf.athlete.name}</div>
              <div className="text-xs text-navy-500">{perf.athlete.affiliation}</div>
            </div>
            <div className="text-right">
              {perf.status === "confirmed" && perf.finalScore !== null ? (
                <div className="font-mono font-bold text-navy-900">
                  {perf.finalScore.toFixed(3)}
                </div>
              ) : (
                <span className="text-xs text-navy-400">{statusLabels[perf.status]}</span>
              )}
            </div>
            {perf.status === "pending" && !currentPerf && (
              <button
                onClick={() => handleStartScoring(perf.id)}
                className="flex items-center gap-1 px-2 py-1 bg-accent text-white rounded text-xs font-medium hover:bg-accent-dark transition-colors"
              >
                <Play className="w-3 h-3" />
                開始
              </button>
            )}
            {perf.status === "pending" && currentPerf && (
              <button
                onClick={() => handleStartScoring(perf.id)}
                className="flex items-center gap-1 px-2 py-1 bg-navy-200 text-navy-600 rounded text-xs font-medium hover:bg-navy-300 transition-colors"
              >
                <SkipForward className="w-3 h-3" />
                次へ
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-navy-400 text-center">
        ※ モックモード: 確定時のスコアはダミー値です
      </p>
    </main>
  );
}
