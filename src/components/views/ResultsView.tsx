"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ResultsTable from "@/components/ResultsTable";
import { getPerformancesWithDetails, getCompetition } from "@/lib/store";
import { PerformanceWithDetails, Competition } from "@/types";
import { Monitor, RefreshCw } from "lucide-react";

export default function ResultsView({ competitionId }: { competitionId: string }) {
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [performances, setPerformances] = useState<PerformanceWithDetails[]>([]);

  const reload = () => {
    setCompetition(getCompetition(competitionId));
    setPerformances(getPerformancesWithDetails(competitionId));
  };

  useEffect(() => {
    reload();
    const interval = setInterval(reload, 3000);
    return () => clearInterval(interval);
  }, [competitionId]);

  const isLive = competition?.status === "in_progress";

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex gap-2 mb-4">
        <Link href={`/competition/${competitionId}/scoreboard`} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-medium hover:bg-navy-800 transition-colors whitespace-nowrap">
          <Monitor className="w-3.5 h-3.5" /> 掲示板モード
        </Link>
        <button onClick={reload} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-100 text-navy-600 rounded-lg text-xs font-medium hover:bg-navy-200 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> 更新
        </button>
      </div>
      {performances.length > 0 ? (
        <ResultsTable performances={performances} competitionName={competition?.name ?? ""} isLive={isLive} />
      ) : (
        <div className="bg-white rounded-xl border border-navy-200 p-12 text-center text-navy-400">
          <p className="mb-1">まだ演技データがありません</p>
          <p className="text-sm">管理画面で競技を開始してください</p>
        </div>
      )}
      {isLive && <p className="text-xs text-navy-400 text-center mt-3">3秒ごとに自動更新されます</p>}
    </main>
  );
}
