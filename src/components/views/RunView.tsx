"use client";

import { useState, useEffect, useCallback } from "react";
import { competitionHref } from "@/lib/navigation";
import {
  getCompetition, getPerformancesWithDetails, initPerformances,
  setCurrentPerformance, confirmPerformance, recalcRanks, updateCompetition, getAthletes,
  setScoreboardDisplay, getScoreboardDisplay,
} from "@/lib/store";
import { calculateFinalScore } from "@/lib/scoring";
import { PerformanceWithDetails, Competition } from "@/types";
import { Play, CheckCircle, Clock, Loader2, RefreshCw, Pencil, X, Monitor, Trophy } from "lucide-react";
import LiveBadge from "@/components/LiveBadge";

function StatusIcon({ status }: { status: string }) {
  if (status === "confirmed") return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (status === "scoring") return <Loader2 className="w-5 h-5 text-accent animate-spin" />;
  return <Clock className="w-5 h-5 text-navy-400" />;
}

const statusLabels: Record<string, string> = { pending: "待機中", scoring: "採点中", confirmed: "確定" };

export default function RunView({ competitionId }: { competitionId: string }) {
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [performances, setPerformances] = useState<PerformanceWithDetails[]>([]);
  const [confirmForm, setConfirmForm] = useState({ dScore: "", eScore: "", ndScore: "0", bonus: "0" });
  const [editingPerfId, setEditingPerfId] = useState<string | null>(null);
  const [displayPerfId, setDisplayPerfId] = useState<string | null>(null);

  const reload = useCallback(() => {
    setCompetition(getCompetition(competitionId));
    initPerformances(competitionId);
    setPerformances(getPerformancesWithDetails(competitionId));
    const sbDisplay = getScoreboardDisplay(competitionId);
    setDisplayPerfId(sbDisplay.mode === "performance" ? (sbDisplay.performanceId ?? null) : null);
  }, [competitionId]);

  useEffect(() => { reload(); }, [reload]);

  const sortedByOrder = [...performances].sort((a, b) => a.athlete.startOrder - b.athlete.startOrder);
  const currentPerf = performances.find((p) => p.isCurrent);
  const editingPerf = editingPerfId ? performances.find((p) => p.id === editingPerfId) : null;

  const handleStartScoring = (perfId: string) => {
    setEditingPerfId(null);
    setCurrentPerformance(competitionId, perfId);
    if (competition?.status !== "in_progress") updateCompetition(competitionId, { status: "in_progress" });
    setConfirmForm({ dScore: "", eScore: "", ndScore: "0", bonus: "0" });
    reload();
  };

  const handleStartEdit = (perf: PerformanceWithDetails) => {
    setEditingPerfId(perf.id);
    setConfirmForm({
      dScore: perf.dScore?.toString() ?? "",
      eScore: perf.eScore?.toString() ?? "",
      ndScore: perf.ndScore?.toString() ?? "0",
      bonus: perf.bonus?.toString() ?? "0",
    });
  };

  const handleCancelEdit = () => {
    setEditingPerfId(null);
    setConfirmForm({ dScore: "", eScore: "", ndScore: "0", bonus: "0" });
  };

  const handleConfirm = () => {
    const targetPerf = editingPerf ?? currentPerf;
    if (!targetPerf) return;
    const d = parseFloat(confirmForm.dScore);
    const e = parseFloat(confirmForm.eScore);
    const nd = parseFloat(confirmForm.ndScore) || 0;
    const b = parseFloat(confirmForm.bonus) || 0;
    if (isNaN(d) || isNaN(e)) return;
    const final = calculateFinalScore(d, e, nd, b);
    if (final === null) return;
    confirmPerformance(targetPerf.id, d, e, nd, final, b);
    recalcRanks(competitionId);
    setConfirmForm({ dScore: "", eScore: "", ndScore: "0", bonus: "0" });
    setEditingPerfId(null);
    reload();
  };

  const handleShowOnScoreboard = (perfId: string) => {
    setScoreboardDisplay(competitionId, "performance", perfId);
    setDisplayPerfId(perfId);
  };

  const handleShowRanking = () => {
    setScoreboardDisplay(competitionId, "ranking");
    setDisplayPerfId(null);
  };

  const handleShowAuto = () => {
    setScoreboardDisplay(competitionId, "auto");
    setDisplayPerfId(null);
  };

  if (getAthletes(competitionId).length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-navy-900 mb-4">競技進行管理</h1>
        <div className="bg-navy-50 rounded-xl p-8 text-center text-navy-500">
          <p className="mb-2">先に選手を登録してください</p>
          <a href={competitionHref(`${competitionId}/admin/athletes`)} className="text-accent hover:underline text-sm">選手登録ページへ</a>
        </div>
      </main>
    );
  }

  const previewScore = confirmForm.dScore && confirmForm.eScore
    ? ((parseFloat(confirmForm.dScore) || 0) + (parseFloat(confirmForm.eScore) || 0) - (parseFloat(confirmForm.ndScore) || 0) + (parseFloat(confirmForm.bonus) || 0)).toFixed(3)
    : null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy-900">競技進行管理</h1>
        <div className="flex items-center gap-2">
          {competition?.status === "in_progress" && <LiveBadge />}
          <button onClick={reload} className="p-2 text-navy-400 hover:text-navy-600"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Scoreboard control */}
      <div className="bg-navy-900 rounded-xl p-3 mb-6 flex items-center gap-2 flex-wrap">
        <Monitor className="w-4 h-4 text-navy-400 shrink-0" />
        <span className="text-xs text-navy-400 shrink-0">掲示板:</span>
        <button onClick={handleShowAuto} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${!displayPerfId && getScoreboardDisplay(competitionId).mode !== "ranking" ? "bg-accent text-white" : "bg-navy-800 text-navy-300 hover:bg-navy-700"}`}>
          自動
        </button>
        <button onClick={handleShowRanking} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${getScoreboardDisplay(competitionId).mode === "ranking" ? "bg-accent text-white" : "bg-navy-800 text-navy-300 hover:bg-navy-700"}`}>
          <Trophy className="w-3 h-3" /> 順位表
        </button>
      </div>

      {(currentPerf || editingPerf) && (
        <div className={`border-2 rounded-xl p-4 mb-6 ${editingPerf ? "bg-orange-50 border-orange-400" : "bg-accent/5 border-accent"}`}>
          <div className="flex items-center justify-between mb-1">
            <div className={`text-xs font-medium uppercase tracking-wider ${editingPerf ? "text-orange-600" : "text-accent"}`}>
              {editingPerf ? "得点修正" : "現在の演技者"}
            </div>
            {editingPerf && (
              <button onClick={handleCancelEdit} className="text-navy-400 hover:text-navy-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-lg font-bold text-navy-900 mb-1">{(editingPerf ?? currentPerf)!.athlete.name}</div>
          <div className="text-sm text-navy-500 mb-4">{(editingPerf ?? currentPerf)!.athlete.affiliation}</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs text-navy-600 font-medium mb-1">Dスコア</label>
              <input type="number" step="0.1" min="0" max="10" value={confirmForm.dScore} onChange={(e) => setConfirmForm({ ...confirmForm, dScore: e.target.value })} className="w-full px-3 py-2 border border-navy-200 rounded-lg font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="0.0" />
            </div>
            <div>
              <label className="block text-xs text-navy-600 font-medium mb-1">Eスコア</label>
              <input type="number" step="0.05" min="0" max="10" value={confirmForm.eScore} onChange={(e) => setConfirmForm({ ...confirmForm, eScore: e.target.value })} className="w-full px-3 py-2 border border-navy-200 rounded-lg font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="0.000" />
            </div>
            <div>
              <label className="block text-xs text-navy-600 font-medium mb-1">ND（減点）</label>
              <input type="number" step="0.1" min="0" max="5" value={confirmForm.ndScore} onChange={(e) => setConfirmForm({ ...confirmForm, ndScore: e.target.value })} className="w-full px-3 py-2 border border-navy-200 rounded-lg font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="0.0" />
            </div>
            <div>
              <label className="block text-xs text-navy-600 font-medium mb-1">加点ボーナス</label>
              <div className="flex gap-2">
                <input type="number" step="0.1" min="0" max="1" value={confirmForm.bonus} onChange={(e) => setConfirmForm({ ...confirmForm, bonus: e.target.value })} className="w-full px-3 py-2 border border-navy-200 rounded-lg font-mono text-center text-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="0.0" />
                <button type="button" onClick={() => setConfirmForm({ ...confirmForm, bonus: "0.1" })} className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${confirmForm.bonus === "0.1" ? "bg-green-600 text-white" : "bg-navy-100 hover:bg-navy-200 text-navy-700"}`}>+0.1</button>
              </div>
            </div>
          </div>
          {previewScore && (
            <div className="bg-white rounded-lg p-3 mb-4 text-center">
              <div className="text-xs text-navy-500 mb-1">最終得点プレビュー</div>
              <div className="font-mono text-3xl font-bold text-navy-900">{previewScore}</div>
            </div>
          )}
          <button onClick={handleConfirm} disabled={!confirmForm.dScore || !confirmForm.eScore} className={`w-full flex items-center justify-center gap-2 py-3 text-white rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${editingPerf ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"}`}>
            <CheckCircle className="w-4 h-4" /> {editingPerf ? "修正を保存" : "スコア確定"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
        <div className="px-4 py-2 bg-navy-100"><h3 className="text-sm font-medium text-navy-700">演技順</h3></div>
        {sortedByOrder.map((perf) => (
          <div key={perf.id} className={`flex items-center gap-3 px-4 py-3 border-b border-navy-100 last:border-b-0 ${perf.isCurrent ? "bg-accent/5" : ""}`}>
            <div className="w-6 text-center text-sm font-mono text-navy-500">{perf.athlete.startOrder}</div>
            <StatusIcon status={perf.status} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-navy-900 truncate">{perf.athlete.name}</div>
              <div className="text-xs text-navy-500">{perf.athlete.affiliation}</div>
            </div>
            <div className="text-right">
              {perf.status === "confirmed" && perf.finalScore !== null ? (
                <div>
                  <div className="font-mono font-bold text-navy-900">{perf.finalScore.toFixed(3)}</div>
                  {perf.rank && <div className="text-xs text-accent font-medium">{perf.rank}位</div>}
                </div>
              ) : (
                <span className="text-xs text-navy-400">{statusLabels[perf.status]}</span>
              )}
            </div>
            {perf.status === "pending" && !perf.isCurrent && (
              <button onClick={() => handleStartScoring(perf.id)} className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors">
                <Play className="w-3 h-3" /> 開始
              </button>
            )}
            {perf.status === "confirmed" && (
              <>
                <button onClick={() => handleShowOnScoreboard(perf.id)} className={`flex items-center gap-1 px-2 py-1.5 transition-colors ${displayPerfId === perf.id ? "text-accent" : "text-navy-300 hover:text-accent"}`} title="掲示板に表示">
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleStartEdit(perf)} className="flex items-center gap-1 px-2 py-1.5 text-navy-400 hover:text-orange-500 transition-colors" title="得点修正">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
