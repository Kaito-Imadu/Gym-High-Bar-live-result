"use client";

import { use, useState, useEffect, useCallback } from "react";
import {
  getCompetition,
  getPerformancesWithDetails,
  initPerformances,
  setCurrentPerformance,
  confirmPerformance,
  recalcRanks,
  updateCompetition,
  getAthletes,
} from "@/lib/store";
import { calculateEScore, calculateFinalScore } from "@/lib/scoring";
import { PerformanceWithDetails, Competition } from "@/types";
import { Play, CheckCircle, Clock, Loader2, RefreshCw } from "lucide-react";
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
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [performances, setPerformances] = useState<PerformanceWithDetails[]>([]);
  const [confirmForm, setConfirmForm] = useState({ dScore: "", eScore: "", ndScore: "0" });

  const reload = useCallback(() => {
    setCompetition(getCompetition(competitionId));
    initPerformances(competitionId);
    setPerformances(getPerformancesWithDetails(competitionId));
  }, [competitionId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const sortedByOrder = [...performances].sort(
    (a, b) => a.athlete.startOrder - b.athlete.startOrder
  );

  const currentPerf = performances.find((p) => p.isCurrent);

  const handleStartScoring = (perfId: string) => {
    setCurrentPerformance(competitionId, perfId);
    if (competition?.status !== "in_progress") {
      updateCompetition(competitionId, { status: "in_progress" });
    }
    setConfirmForm({ dScore: "", eScore: "", ndScore: "0" });
    reload();
  };

  const handleConfirm = () => {
    if (!currentPerf) return;
    const d = parseFloat(confirmForm.dScore);
    const e = parseFloat(confirmForm.eScore);
    const nd = parseFloat(confirmForm.ndScore) || 0;
    if (isNaN(d) || isNaN(e)) return;
    const final = calculateFinalScore(d, e, nd);
    if (final === null) return;
    confirmPerformance(currentPerf.id, d, e, nd, final);
    recalcRanks(competitionId);
    setConfirmForm({ dScore: "", eScore: "", ndScore: "0" });
    reload();
  };

  const athleteCount = getAthletes(competitionId).length;

  if (athleteCount === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-navy-900 mb-4">競技進行管理</h1>
        <div className="bg-navy-50 rounded-xl p-8 text-center text-navy-500">
          <p className="mb-2">先に選手を登録してください</p>
          <a href={`/competition/${competitionId}/admin/athletes`} className="text-accent hover:underline text-sm">
            選手登録ページへ
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy-900">競技進行管理</h1>
        <div className="flex items-center gap-2">
          {competition?.status === "in_progress" && <LiveBadge />}
          <button onClick={reload} className="p-2 text-navy-400 hover:text-navy-600">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current performer + score entry */}
      {currentPerf && (
        <div className="bg-accent/5 border-2 border-accent rounded-xl p-4 mb-6">
          <div className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
            現在の演技者
          </div>
          <div className="text-lg font-bold text-navy-900 mb-1">
            {currentPerf.athlete.name}
          </div>
          <div className="text-sm text-navy-500 mb-4">
            {currentPerf.athlete.affiliation}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs text-navy-600 font-medium mb-1">Dスコア</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={confirmForm.dScore}
                onChange={(e) => setConfirmForm({ ...confirmForm, dScore: e.target.value })}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-xs text-navy-600 font-medium mb-1">Eスコア</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="10"
                value={confirmForm.eScore}
                onChange={(e) => setConfirmForm({ ...confirmForm, eScore: e.target.value })}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.000"
              />
            </div>
            <div>
              <label className="block text-xs text-navy-600 font-medium mb-1">ND</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={confirmForm.ndScore}
                onChange={(e) => setConfirmForm({ ...confirmForm, ndScore: e.target.value })}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Preview */}
          {confirmForm.dScore && confirmForm.eScore && (
            <div className="bg-white rounded-lg p-3 mb-4 text-center">
              <div className="text-xs text-navy-500 mb-1">最終得点プレビュー</div>
              <div className="font-mono text-3xl font-bold text-navy-900">
                {(
                  (parseFloat(confirmForm.dScore) || 0) +
                  (parseFloat(confirmForm.eScore) || 0) -
                  (parseFloat(confirmForm.ndScore) || 0)
                ).toFixed(3)}
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!confirmForm.dScore || !confirmForm.eScore}
            className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                <div>
                  <div className="font-mono font-bold text-navy-900">
                    {perf.finalScore.toFixed(3)}
                  </div>
                  {perf.rank && (
                    <div className="text-xs text-accent font-medium">{perf.rank}位</div>
                  )}
                </div>
              ) : (
                <span className="text-xs text-navy-400">{statusLabels[perf.status]}</span>
              )}
            </div>
            {perf.status === "pending" && !perf.isCurrent && (
              <button
                onClick={() => handleStartScoring(perf.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors"
              >
                <Play className="w-3 h-3" />
                開始
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
