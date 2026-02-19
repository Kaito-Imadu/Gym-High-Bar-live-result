"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { getCompetition } from "@/lib/store";
import AdminView from "@/components/views/AdminView";
import AthletesView from "@/components/views/AthletesView";
import JudgesView from "@/components/views/JudgesView";
import RunView from "@/components/views/RunView";
import ResultsView from "@/components/views/ResultsView";
import ScoreboardView from "@/components/views/ScoreboardView";
import JudgeLoginView from "@/components/views/JudgeLoginView";
import JudgeScoreView from "@/components/views/JudgeScoreView";

function CompetitionRouter({ segments }: { segments: string[] }) {
  const searchParams = useSearchParams();
  let resolvedSegments = segments;
  const fallbackPath = searchParams.get("p");
  if (resolvedSegments.length === 0 && fallbackPath) {
    resolvedSegments = decodeURIComponent(fallbackPath).split("/").filter(Boolean);
  }

  const competitionId = resolvedSegments[0] || "";
  const view = resolvedSegments[1] || "results";
  const subView = resolvedSegments[2] || "";

  const [compName, setCompName] = useState("");

  useEffect(() => {
    if (competitionId) {
      const comp = getCompetition(competitionId);
      setCompName(comp?.name ?? "");
    }
  }, [competitionId]);

  if (!competitionId) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12 text-center text-navy-500">
          大会が見つかりません
        </main>
      </div>
    );
  }

  if (view === "scoreboard") {
    return <ScoreboardView competitionId={competitionId} />;
  }

  const renderView = () => {
    switch (view) {
      case "admin":
        switch (subView) {
          case "athletes": return <AthletesView competitionId={competitionId} />;
          case "judges": return <JudgesView competitionId={competitionId} />;
          case "run": return <RunView competitionId={competitionId} />;
          default: return <AdminView competitionId={competitionId} />;
        }
      case "judge":
        if (subView === "score") return <JudgeScoreView competitionId={competitionId} />;
        return <JudgeLoginView competitionId={competitionId} />;
      case "results":
      default:
        return <ResultsView competitionId={competitionId} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header competitionName={compName} competitionId={competitionId} />
      {renderView()}
    </div>
  );
}

export default function CompetitionPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments = [] } = use(params);

  return (
    <Suspense fallback={<div className="p-8 text-center text-navy-400">読み込み中...</div>}>
      <CompetitionRouter segments={segments} />
    </Suspense>
  );
}
