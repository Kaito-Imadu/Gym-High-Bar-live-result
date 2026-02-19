"use client";

import { useState, useEffect, useCallback } from "react";
import ResultsTable from "@/components/ResultsTable";
import { competitionHref } from "@/lib/navigation";
import { getPerformancesWithDetails, getCompetition, initPerformances } from "@/lib/store";
import { PerformanceWithDetails, Competition } from "@/types";
import { Monitor, RefreshCw } from "lucide-react";

export default function ResultsView({ competitionId }: { competitionId: string }) {
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [performances, setPerformances] = useState<PerformanceWithDetails[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const reload = useCallback(() => {
    setCompetition(getCompetition(competitionId));
    initPerformances(competitionId);
    const perfs = getPerformancesWithDetails(competitionId);
    setPerformances(perfs);
    setLastUpdate(new Date().toLocaleTimeString("ja-JP"));
  }, [competitionId]);

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 3000);
    return () => clearInterval(interval);
  }, [reload]);

  const handleManualReload = () => {
    setRefreshing(true);
    reload();
    setTimeout(() => setRefreshing(false), 600);
  };

  const isLive = competition?.status === "in_progress";

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <a href={competitionHref(`${competitionId}/scoreboard`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-medium hover:bg-navy-800 transition-colors whitespace-nowrap">
          <Monitor className="w-3.5 h-3.5" /> 掲示板モード
        </a>
        <button onClick={handleManualReload} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-100 text-navy-600 rounded-lg text-xs font-medium hover:bg-navy-200 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> 更新
        </button>
        {lastUpdate && <span className="text-xs text-navy-400 ml-auto">最終更新: {lastUpdate}</span>}
      </div>
      {performances.length > 0 ? (
        <ResultsTable performances={performances} competitionName={competition?.name ?? ""} isLive={isLive} />
      ) : (
        <div className="bg-white rounded-xl border border-navy-200 p-12 text-center text-navy-400">
          <p className="mb-1">まだ演技データがありません</p>
          <p className="text-sm">管理画面で選手を登録し、競技を開始してください</p>
        </div>
      )}
      {isLive && <p className="text-xs text-navy-400 text-center mt-3">3秒ごとに自動更新されます</p>}
    </main>
  );
}
