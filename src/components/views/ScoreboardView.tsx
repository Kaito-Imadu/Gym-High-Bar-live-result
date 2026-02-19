"use client";

import { useState, useEffect } from "react";
import { getPerformancesWithDetails, getCompetition } from "@/lib/store";
import LiveBadge from "@/components/LiveBadge";
import HighBarIcon from "@/components/HighBarIcon";
import { PerformanceWithDetails, Competition } from "@/types";
import { Trophy } from "lucide-react";

function CurrentPerformer({ perf }: { perf: PerformanceWithDetails }) {
  return (
    <div className="text-center">
      <div className="text-navy-400 text-lg sm:text-xl mb-3 uppercase tracking-wider">現在の演技</div>
      <div className="text-4xl sm:text-6xl font-bold text-white mb-2">{perf.athlete.name}</div>
      <div className="text-navy-400 text-xl sm:text-2xl mb-6">{perf.athlete.affiliation}</div>
      {perf.dScore !== null && (
        <div className="inline-block bg-navy-800 rounded-2xl px-10 py-6">
          <div className="text-navy-400 text-sm mb-1">Dスコア</div>
          <div className="font-mono text-5xl sm:text-7xl font-bold text-accent-light">{perf.dScore.toFixed(1)}</div>
        </div>
      )}
      <div className="mt-6 text-navy-500 text-lg animate-live-pulse">採点中...</div>
    </div>
  );
}

function LatestResult({ perf }: { perf: PerformanceWithDetails }) {
  return (
    <div className="text-center">
      <div className="text-navy-400 text-lg sm:text-xl mb-3 uppercase tracking-wider">最新の結果</div>
      <div className="text-3xl sm:text-5xl font-bold text-white mb-1">{perf.athlete.name}</div>
      <div className="text-navy-400 text-lg sm:text-xl mb-6">{perf.athlete.affiliation}</div>
      <div className="font-mono text-7xl sm:text-9xl font-bold text-white mb-6">{perf.finalScore?.toFixed(3)}</div>
      <div className="flex justify-center gap-8 text-xl">
        <div><span className="text-navy-400">D: </span><span className="font-mono text-white">{perf.dScore?.toFixed(1)}</span></div>
        <div><span className="text-navy-400">E: </span><span className="font-mono text-white">{perf.eScore?.toFixed(3)}</span></div>
        {perf.ndScore !== null && perf.ndScore > 0 && (
          <div><span className="text-navy-400">減点: </span><span className="font-mono text-red-400">-{perf.ndScore.toFixed(1)}</span></div>
        )}
      </div>
      {perf.rank && <div className="mt-6 text-3xl text-gold font-bold">現在 {perf.rank}位</div>}
    </div>
  );
}

function RankingView({ performances }: { performances: PerformanceWithDetails[] }) {
  const ranked = performances.filter((p) => p.status === "confirmed" && p.rank !== null).sort((a, b) => a.rank! - b.rank!);
  if (ranked.length === 0) return null;
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-navy-400 text-center text-lg mb-4 uppercase tracking-wider">全体順位</div>
      <div className="space-y-2">
        {ranked.map((p) => (
          <div key={p.id} className={`flex items-center gap-4 px-6 py-3 rounded-xl ${
            p.rank === 1 ? "bg-gold/20 border border-gold/30" : p.rank === 2 ? "bg-silver/20 border border-silver/30" : p.rank === 3 ? "bg-bronze/20 border border-bronze/30" : "bg-navy-800/50"
          }`}>
            <div className="w-12 text-center">
              {p.rank! <= 3 ? <Trophy className={`w-6 h-6 mx-auto ${p.rank === 1 ? "text-gold" : p.rank === 2 ? "text-silver" : "text-bronze"}`} /> : <span className="text-2xl font-bold text-navy-400">{p.rank}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-bold text-white truncate">{p.athlete.name}</div>
              <div className="text-sm text-navy-400">{p.athlete.affiliation}</div>
            </div>
            <div className="font-mono text-3xl font-bold text-white">{p.finalScore?.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScoreboardView({ competitionId }: { competitionId: string }) {
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [performances, setPerformances] = useState<PerformanceWithDetails[]>([]);

  useEffect(() => {
    const reload = () => {
      setCompetition(getCompetition(competitionId));
      setPerformances(getPerformancesWithDetails(competitionId));
    };
    reload();
    const interval = setInterval(reload, 2000);
    return () => clearInterval(interval);
  }, [competitionId]);

  const currentPerf = performances.find((p) => p.isCurrent);
  const confirmedPerfs = performances.filter((p) => p.status === "confirmed" && p.rank !== null).sort((a, b) => a.rank! - b.rank!);
  const latestConfirmed = performances.filter((p) => p.status === "confirmed").sort((a, b) => b.athlete.startOrder - a.athlete.startOrder)[0];
  const showRanking = !currentPerf && confirmedPerfs.length > 1;

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-black/30">
        <div className="flex items-center gap-3">
          <HighBarIcon className="w-6 h-6 text-accent-light" />
          <span className="text-white font-bold text-sm sm:text-base">{competition?.name}</span>
        </div>
        {competition?.status === "in_progress" && <LiveBadge />}
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {currentPerf ? <CurrentPerformer perf={currentPerf} /> : showRanking ? <RankingView performances={performances} /> : latestConfirmed ? <LatestResult perf={latestConfirmed} /> : <div className="text-center text-navy-400 text-2xl">競技開始をお待ちください</div>}
      </div>
      {(currentPerf || (latestConfirmed && !showRanking)) && confirmedPerfs.length > 0 && (
        <div className="bg-black/30 px-4 py-3">
          <div className="flex gap-4 overflow-x-auto max-w-5xl mx-auto">
            {confirmedPerfs.slice(0, 6).map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="text-gold font-bold">{p.rank}.</span>
                <span className="text-white font-medium">{p.athlete.name}</span>
                <span className="font-mono text-accent-light">{p.finalScore?.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
