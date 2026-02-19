"use client";

import { use } from "react";
import Link from "next/link";
import { getCompetition, getAthletes, getJudgePanels, getPerformancesWithDetails } from "@/lib/mock-data";
import { Users, Clipboard, Play, ChevronRight } from "lucide-react";

export default function AdminDashboardPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const competition = getCompetition(competitionId);
  const athletes = getAthletes(competitionId);
  const judges = getJudgePanels(competitionId);
  const performances = getPerformancesWithDetails(competitionId);

  const confirmed = performances.filter((p) => p.status === "confirmed").length;
  const total = performances.length;

  const menuItems = [
    {
      href: `/competition/${competitionId}/admin/athletes`,
      icon: Users,
      title: "選手管理",
      description: `${athletes.length}名 登録済み`,
    },
    {
      href: `/competition/${competitionId}/admin/judges`,
      icon: Clipboard,
      title: "審判設定",
      description: `${judges.length}名 設定済み`,
    },
    {
      href: `/competition/${competitionId}/admin/run`,
      icon: Play,
      title: "競技進行",
      description: `${confirmed}/${total} 完了`,
    },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-navy-900 mb-2">管理ダッシュボード</h1>
      <p className="text-sm text-navy-500 mb-6">{competition?.name}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-navy-200 p-3 text-center">
          <div className="text-2xl font-bold text-navy-900">{athletes.length}</div>
          <div className="text-xs text-navy-500">選手</div>
        </div>
        <div className="bg-white rounded-xl border border-navy-200 p-3 text-center">
          <div className="text-2xl font-bold text-navy-900">{judges.length}</div>
          <div className="text-xs text-navy-500">審判</div>
        </div>
        <div className="bg-white rounded-xl border border-navy-200 p-3 text-center">
          <div className="text-2xl font-bold text-accent">{confirmed}/{total}</div>
          <div className="text-xs text-navy-500">進行状況</div>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 bg-white rounded-xl border border-navy-200 p-4 hover:border-accent hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <item.icon className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-navy-900">{item.title}</div>
              <div className="text-sm text-navy-500">{item.description}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-navy-400 group-hover:text-accent" />
          </Link>
        ))}
      </div>
    </main>
  );
}
