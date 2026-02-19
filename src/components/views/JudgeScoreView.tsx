"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getPerformancesWithDetails, getCompetition, submitJudgeScore, getJudgePanels } from "@/lib/store";
import { JudgeRole, PerformanceWithDetails, Competition } from "@/types";
import { Send, CheckCircle2, User } from "lucide-react";
import LiveBadge from "@/components/LiveBadge";

function ScoreInputD({ onSubmit }: { onSubmit: (s: number) => void }) {
  const [v, setV] = useState("");
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">Dスコア（難度点）</label>
      <input type="number" step="0.1" min="0" max="10" value={v} onChange={(e) => setV(e.target.value)} className="w-full px-4 py-3 text-2xl font-mono text-center border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" placeholder="0.0" />
      <button onClick={() => { const n = parseFloat(v); if (!isNaN(n) && n >= 0 && n <= 10) onSubmit(n); }} className="w-full mt-3 py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark"><Send className="w-4 h-4" /> 送信</button>
    </div>
  );
}

function ScoreInputE({ onSubmit }: { onSubmit: (s: number) => void }) {
  const [v, setV] = useState("");
  const presets = [7.5, 7.8, 8.0, 8.2, 8.5, 8.8, 9.0, 9.2, 9.5];
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">Eスコア（実施点）</label>
      <input type="number" step="0.05" min="0" max="10" value={v} onChange={(e) => setV(e.target.value)} className="w-full px-4 py-3 text-2xl font-mono text-center border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent mb-3" placeholder="0.000" />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {presets.map((p) => (<button key={p} type="button" onClick={() => setV(p.toFixed(1))} className="py-2 bg-navy-100 rounded-lg font-mono text-sm hover:bg-navy-200">{p.toFixed(1)}</button>))}
      </div>
      <button onClick={() => { const n = parseFloat(v); if (!isNaN(n) && n >= 0 && n <= 10) onSubmit(n); }} className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark"><Send className="w-4 h-4" /> 送信</button>
    </div>
  );
}

function ScoreInputND({ onSubmit }: { onSubmit: (s: number) => void }) {
  const [v, setV] = useState("0");
  const presets = [0, 0.1, 0.3, 0.5];
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">ND（ニュートラルディダクション）</label>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {presets.map((p) => (<button key={p} type="button" onClick={() => setV(p.toFixed(1))} className={`py-3 rounded-lg font-mono text-lg transition-colors ${parseFloat(v) === p ? "bg-red-600 text-white" : "bg-navy-100 hover:bg-navy-200"}`}>{p === 0 ? "なし" : `-${p.toFixed(1)}`}</button>))}
      </div>
      <button onClick={() => { const n = parseFloat(v); if (!isNaN(n)) onSubmit(n); }} className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark"><Send className="w-4 h-4" /> 送信</button>
    </div>
  );
}

export default function JudgeScoreView({ competitionId }: { competitionId: string }) {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") ?? "E1") as JudgeRole;
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [currentPerf, setCurrentPerf] = useState<PerformanceWithDetails | undefined>();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const reload = () => {
      setCompetition(getCompetition(competitionId));
      const perfs = getPerformancesWithDetails(competitionId);
      const current = perfs.find((p) => p.isCurrent);
      if (current?.id !== currentPerf?.id) setSubmitted(false);
      setCurrentPerf(current);
    };
    reload();
    const interval = setInterval(reload, 2000);
    return () => clearInterval(interval);
  }, [competitionId]);

  const handleSubmit = (score: number) => {
    if (!currentPerf) return;
    const panels = getJudgePanels(competitionId);
    const panel = panels.find((p) => p.role === role);
    if (panel) submitJudgeScore(currentPerf.id, panel.id, role, score);
    setSubmitted(true);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-bold">{role}</span>
          {competition?.status === "in_progress" && <LiveBadge />}
        </div>
      </div>
      {currentPerf ? (
        <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-navy-400" /><span className="text-xs text-navy-500 uppercase tracking-wider">現在の演技者</span></div>
          <div className="text-xl font-bold text-navy-900 mb-1">{currentPerf.athlete.name}</div>
          <div className="text-sm text-navy-500">{currentPerf.athlete.affiliation}</div>
        </div>
      ) : (
        <div className="bg-navy-100 rounded-xl p-6 text-center text-navy-500 mb-4">演技者を待っています...</div>
      )}
      {currentPerf && !submitted && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-4">
          {role.startsWith("D") && <ScoreInputD onSubmit={handleSubmit} />}
          {role.startsWith("E") && <ScoreInputE onSubmit={handleSubmit} />}
          {role === "ND" && <ScoreInputND onSubmit={handleSubmit} />}
        </div>
      )}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <div className="text-green-800 font-medium">スコアを送信しました</div>
          <button onClick={() => setSubmitted(false)} className="mt-3 text-sm text-accent hover:underline">修正する</button>
        </div>
      )}
    </main>
  );
}
