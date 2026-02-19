"use client";

import { useState } from "react";
import { PerformanceWithDetails } from "@/types";
import ResultRow from "./ResultRow";
import LiveBadge from "./LiveBadge";

interface ResultsTableProps {
  performances: PerformanceWithDetails[];
  competitionName: string;
  isLive: boolean;
}

export default function ResultsTable({ performances, competitionName, isLive }: ResultsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort: confirmed by rank, then scoring, then pending
  const sorted = [...performances].sort((a, b) => {
    const statusOrder = { confirmed: 0, scoring: 1, pending: 2 };
    const aOrder = statusOrder[a.status];
    const bOrder = statusOrder[b.status];
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
    if (a.rank !== null) return -1;
    if (b.rank !== null) return 1;
    return a.athlete.startOrder - b.athlete.startOrder;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-navy-900 text-white flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base sm:text-lg">鉄棒 - 成績速報</h2>
          <div className="text-xs text-navy-300">{competitionName}</div>
        </div>
        {isLive && <LiveBadge />}
      </div>

      {/* Table header */}
      <div className="px-3 py-2 bg-navy-100 flex items-center gap-2 text-xs text-navy-600 font-medium">
        <div className="w-8 text-center">順位</div>
        <div className="flex-1">選手</div>
        <div className="text-right mr-6">得点</div>
      </div>

      {/* Rows */}
      <div>
        {sorted.map((perf) => (
          <ResultRow
            key={perf.id}
            performance={perf}
            isExpanded={expandedId === perf.id}
            onToggle={() => setExpandedId(expandedId === perf.id ? null : perf.id)}
          />
        ))}
      </div>

      {performances.length === 0 && (
        <div className="px-4 py-12 text-center text-navy-400">
          まだ演技データがありません
        </div>
      )}
    </div>
  );
}
