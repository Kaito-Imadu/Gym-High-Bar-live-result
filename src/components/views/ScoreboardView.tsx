"use client";

import { useState, useEffect } from "react";
import { getPerformancesWithDetails, getCompetition, initPerformances, getScoreboardDisplay, ScoreboardMode } from "@/lib/store";
import LiveBadge from "@/components/LiveBadge";
import HighBarIcon from "@/components/HighBarIcon";
import { PerformanceWithDetails, Competition } from "@/types";
import { Trophy, ChevronLeft, ChevronRight, BarChart3, User } from "lucide-react";

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

function AthleteResult({ perf }: { perf: PerformanceWithDetails }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-5xl font-bold text-white mb-1">{perf.athlete.name}</div>
      <div className="text-navy-400 text-lg sm:text-xl mb-6">{perf.athlete.affiliation}</div>
      <div className="font-mono text-7xl sm:text-9xl font-bold text-white mb-6">{perf.finalScore?.toFixed(3)}</div>
      <div className="flex justify-center gap-6 sm:gap-8 text-lg sm:text-xl flex-wrap">
        <div className="bg-navy-800 rounded-xl px-4 py-2">
          <span className="text-navy-400 text-sm block">D</span>
          <span className="font-mono text-white font-bold">{perf.dScore?.toFixed(1)}</span>
        </div>
        <div className="bg-navy-800 rounded-xl px-4 py-2">
          <span className="text-navy-400 text-sm block">E</span>
          <span className="font-mono text-white font-bold">{perf.eScore?.toFixed(3)}</span>
        </div>
        {perf.ndScore !== null && perf.ndScore > 0 && (
          <div className="bg-navy-800 rounded-xl px-4 py-2">
            <span className="text-navy-400 text-sm block">減点</span>
            <span className="font-mono text-red-400 font-bold">-{perf.ndScore.toFixed(1)}</span>
          </div>
        )}
        {perf.bonus !== null && perf.bonus > 0 && (
          <div className="bg-navy-800 rounded-xl px-4 py-2">
            <span className="text-navy-400 text-sm block">加点</span>
            <span className="font-mono text-green-400 font-bold">+{perf.bonus.toFixed(1)}</span>
          </div>
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
            <div className="text-right">
              <div className="font-mono text-3xl font-bold text-white">{p.finalScore?.toFixed(3)}</div>
              <div className="text-xs text-navy-500">D {p.dScore?.toFixed(1)} / E {p.eScore?.toFixed(3)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type LocalView = "auto" | "live" | "ranking" | "athlete";

export default function ScoreboardView({ competitionId }: { competitionId: string }) {
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [performances, setPerformances] = useState<PerformanceWithDetails[]>([]);
  const [displayMode, setDisplayMode] = useState<ScoreboardMode>("auto");
  const [displayPerfId, setDisplayPerfId] = useState<string | undefined>();

  // Local view control (on the scoreboard itself)
  const [localView, setLocalView] = useState<LocalView>("auto");
  const [selectedAthleteIndex, setSelectedAthleteIndex] = useState(0);

  useEffect(() => {
    const reload = () => {
      setCompetition(getCompetition(competitionId));
      initPerformances(competitionId);
      setPerformances(getPerformancesWithDetails(competitionId));
      const sbDisplay = getScoreboardDisplay(competitionId);
      setDisplayMode(sbDisplay.mode);
      setDisplayPerfId(sbDisplay.performanceId);
    };
    reload();
    const interval = setInterval(reload, 2000);
    return () => clearInterval(interval);
  }, [competitionId]);

  const currentPerf = performances.find((p) => p.isCurrent);
  const confirmedPerfs = performances.filter((p) => p.status === "confirmed" && p.rank !== null).sort((a, b) => a.rank! - b.rank!);
  const confirmedByOrder = performances.filter((p) => p.status === "confirmed").sort((a, b) => a.athlete.startOrder - b.athlete.startOrder);

  // Clamp selected index
  const clampedIndex = Math.min(selectedAthleteIndex, Math.max(confirmedByOrder.length - 1, 0));
  const selectedPerf = confirmedByOrder[clampedIndex];

  const handlePrev = () => setSelectedAthleteIndex(Math.max(0, clampedIndex - 1));
  const handleNext = () => setSelectedAthleteIndex(Math.min(confirmedByOrder.length - 1, clampedIndex + 1));

  const renderContent = () => {
    // Local view takes precedence when manually selected
    if (localView === "live") {
      if (currentPerf) return <CurrentPerformer perf={currentPerf} />;
      return <div className="text-center text-navy-400 text-2xl">演技者を待っています...</div>;
    }
    if (localView === "ranking" && confirmedPerfs.length > 0) {
      return <RankingView performances={performances} />;
    }
    if (localView === "athlete" && selectedPerf) {
      return <AthleteResult perf={selectedPerf} />;
    }

    // Remote control from RunView
    if (displayMode === "performance" && displayPerfId) {
      const targetPerf = performances.find((p) => p.id === displayPerfId);
      if (targetPerf && targetPerf.status === "confirmed") return <AthleteResult perf={targetPerf} />;
    }
    if (displayMode === "ranking" && confirmedPerfs.length > 0) {
      return <RankingView performances={performances} />;
    }

    // Auto mode
    if (currentPerf) return <CurrentPerformer perf={currentPerf} />;
    if (confirmedPerfs.length > 1) return <RankingView performances={performances} />;
    if (confirmedPerfs.length === 1) return <AthleteResult perf={confirmedPerfs[0]} />;
    return <div className="text-center text-navy-400 text-2xl">競技開始をお待ちください</div>;
  };

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/30">
        <div className="flex items-center gap-3">
          <HighBarIcon className="w-6 h-6 text-accent-light" />
          <span className="text-white font-bold text-sm sm:text-base">{competition?.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {competition?.status === "in_progress" && <LiveBadge />}
        </div>
      </div>

      {/* View toggle bar */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-black/20">
        <button
          onClick={() => { setLocalView("live"); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${localView === "live" ? "bg-red-600 text-white" : "bg-navy-800 text-navy-300 hover:bg-navy-700"}`}
        >
          採点中
        </button>
        <button
          onClick={() => { setLocalView("auto"); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${localView === "auto" ? "bg-accent text-white" : "bg-navy-800 text-navy-300 hover:bg-navy-700"}`}
        >
          自動
        </button>
        <button
          onClick={() => { setLocalView("ranking"); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${localView === "ranking" ? "bg-accent text-white" : "bg-navy-800 text-navy-300 hover:bg-navy-700"}`}
        >
          <BarChart3 className="w-3 h-3" /> 順位表
        </button>
        <button
          onClick={() => { setLocalView("athlete"); setSelectedAthleteIndex(0); }}
          disabled={confirmedByOrder.length === 0}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-30 ${localView === "athlete" ? "bg-accent text-white" : "bg-navy-800 text-navy-300 hover:bg-navy-700"}`}
        >
          <User className="w-3 h-3" /> 個人詳細
        </button>
      </div>

      {/* Athlete navigation (only in athlete view) */}
      {localView === "athlete" && confirmedByOrder.length > 0 && (
        <div className="flex items-center justify-center gap-4 px-4 py-2 bg-black/10">
          <button onClick={handlePrev} disabled={clampedIndex === 0} className="p-2 text-navy-400 hover:text-white disabled:opacity-20 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-1">
            {confirmedByOrder.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelectedAthleteIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === clampedIndex ? "bg-accent" : "bg-navy-600 hover:bg-navy-400"}`}
              />
            ))}
          </div>
          <button onClick={handleNext} disabled={clampedIndex >= confirmedByOrder.length - 1} className="p-2 text-navy-400 hover:text-white disabled:opacity-20 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
          <span className="text-navy-400 text-xs">{clampedIndex + 1} / {confirmedByOrder.length}</span>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {renderContent()}
      </div>

      {/* Bottom ranking bar */}
      {localView !== "ranking" && confirmedPerfs.length > 0 && (
        <div className="bg-black/30 px-4 py-3">
          <div className="flex gap-4 overflow-x-auto max-w-5xl mx-auto">
            {confirmedPerfs.slice(0, 8).map((p) => (
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
