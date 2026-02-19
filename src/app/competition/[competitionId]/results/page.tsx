"use client";

import { use } from "react";
import Link from "next/link";
import ResultsTable from "@/components/ResultsTable";
import { getPerformancesWithDetails, getCompetition } from "@/lib/mock-data";
import { Monitor, Settings, Clipboard } from "lucide-react";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const competition = getCompetition(competitionId);
  const performances = getPerformancesWithDetails(competitionId);
  const isLive = competition?.status === "in_progress";

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      {/* Quick links */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <Link
          href={`/competition/${competitionId}/scoreboard`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-medium hover:bg-navy-800 transition-colors whitespace-nowrap"
        >
          <Monitor className="w-3.5 h-3.5" />
          掲示板モード
        </Link>
        <Link
          href={`/competition/${competitionId}/judge`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors whitespace-nowrap"
        >
          <Clipboard className="w-3.5 h-3.5" />
          審判入力
        </Link>
        <Link
          href={`/competition/${competitionId}/admin`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-200 text-navy-700 rounded-lg text-xs font-medium hover:bg-navy-300 transition-colors whitespace-nowrap"
        >
          <Settings className="w-3.5 h-3.5" />
          管理
        </Link>
      </div>

      <ResultsTable
        performances={performances}
        competitionName={competition?.name ?? ""}
        isLive={isLive}
      />
    </main>
  );
}
