"use client";

import { use } from "react";
import { getPerformancesWithDetails, getCompetition } from "@/lib/mock-data";
import LiveBadge from "@/components/LiveBadge";
import HighBarIcon from "@/components/HighBarIcon";
import { PerformanceWithDetails } from "@/types";

function CurrentPerformer({ perf }: { perf: PerformanceWithDetails }) {
  return (
    <div className="text-center">
      <div className="text-navy-400 text-sm sm:text-base mb-2 uppercase tracking-wider">
        現在の演技
      </div>
      <div className="text-3xl sm:text-5xl font-bold text-white mb-2">
        {perf.athlete.name}
      </div>
      <div className="text-navy-400 text-lg sm:text-xl">
        {perf.athlete.affiliation}
      </div>
      {perf.dScore !== null && (
        <div className="mt-6 inline-block bg-navy-800 rounded-2xl px-8 py-4">
          <div className="text-navy-400 text-sm mb-1">Dスコア</div>
          <div className="font-mono text-4xl sm:text-6xl font-bold text-accent-light">
            {perf.dScore.toFixed(1)}
          </div>
        </div>
      )}
      <div className="mt-4 text-navy-500 text-sm animate-live-pulse">
        採点中...
      </div>
    </div>
  );
}

function LatestResult({ perf, rank }: { perf: PerformanceWithDetails; rank: number }) {
  return (
    <div className="text-center">
      <div className="text-navy-400 text-sm sm:text-base mb-2 uppercase tracking-wider">
        最新の結果
      </div>
      <div className="text-2xl sm:text-4xl font-bold text-white mb-1">
        {perf.athlete.name}
      </div>
      <div className="text-navy-400 text-base sm:text-lg mb-4">
        {perf.athlete.affiliation}
      </div>
      <div className="font-mono text-6xl sm:text-8xl font-bold text-white mb-4">
        {perf.finalScore?.toFixed(3)}
      </div>
      <div className="flex justify-center gap-6 text-lg">
        <div>
          <span className="text-navy-400">D: </span>
          <span className="font-mono text-white">{perf.dScore?.toFixed(1)}</span>
        </div>
        <div>
          <span className="text-navy-400">E: </span>
          <span className="font-mono text-white">{perf.eScore?.toFixed(3)}</span>
        </div>
        {perf.ndScore !== null && perf.ndScore > 0 && (
          <div>
            <span className="text-navy-400">減点: </span>
            <span className="font-mono text-red-400">-{perf.ndScore.toFixed(1)}</span>
          </div>
        )}
      </div>
      <div className="mt-4 text-2xl text-gold font-bold">
        現在 {rank}位
      </div>
    </div>
  );
}

export default function ScoreboardPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const competition = getCompetition(competitionId);
  const performances = getPerformancesWithDetails(competitionId);

  const currentPerf = performances.find((p) => p.isCurrent);
  const confirmedPerfs = performances
    .filter((p) => p.status === "confirmed" && p.rank !== null)
    .sort((a, b) => a.rank! - b.rank!);
  const latestConfirmed = confirmedPerfs[confirmedPerfs.length - 1];

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/30">
        <div className="flex items-center gap-3">
          <HighBarIcon className="w-6 h-6 text-accent-light" />
          <span className="text-white font-bold text-sm sm:text-base">
            {competition?.name}
          </span>
        </div>
        {competition?.status === "in_progress" && <LiveBadge />}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {currentPerf ? (
          <CurrentPerformer perf={currentPerf} />
        ) : latestConfirmed ? (
          <LatestResult perf={latestConfirmed} rank={latestConfirmed.rank!} />
        ) : (
          <div className="text-center text-navy-400 text-2xl">
            競技開始をお待ちください
          </div>
        )}
      </div>

      {/* Bottom ranking strip */}
      <div className="bg-black/30 px-4 py-3">
        <div className="flex gap-4 overflow-x-auto max-w-5xl mx-auto">
          {confirmedPerfs.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <span className="text-gold font-bold">{p.rank}.</span>
              <span className="text-white font-medium">{p.athlete.name}</span>
              <span className="font-mono text-accent-light">{p.finalScore?.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
