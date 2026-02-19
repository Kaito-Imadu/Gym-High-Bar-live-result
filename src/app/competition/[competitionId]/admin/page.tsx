"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getCompetition, getAthletes, getJudgePanels, getPerformances, updateCompetition } from "@/lib/store";
import { Competition } from "@/types";
import { Users, Clipboard, Play, ChevronRight, Monitor, BarChart3, Copy, Check, Link as LinkIcon } from "lucide-react";

export default function AdminDashboardPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const [competition, setCompetition] = useState<Competition | undefined>();
  const [athleteCount, setAthleteCount] = useState(0);
  const [judgeCount, setJudgeCount] = useState(0);
  const [perfStats, setPerfStats] = useState({ confirmed: 0, total: 0 });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setCompetition(getCompetition(competitionId));
    setAthleteCount(getAthletes(competitionId).length);
    setJudgeCount(getJudgePanels(competitionId).length);
    const perfs = getPerformances(competitionId);
    setPerfStats({
      confirmed: perfs.filter((p) => p.status === "confirmed").length,
      total: perfs.length,
    });
  }, [competitionId]);

  const handleStatusChange = (status: "upcoming" | "in_progress" | "completed") => {
    updateCompetition(competitionId, { status });
    setCompetition(getCompetition(competitionId));
  };

  const getBaseUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.origin + window.location.pathname.replace(/\/admin$/, "");
  };

  const copyLink = (path: string, key: string) => {
    navigator.clipboard.writeText(`${getBaseUrl()}${path}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const menuItems = [
    {
      href: `/competition/${competitionId}/admin/athletes`,
      icon: Users,
      title: "選手登録",
      description: `${athleteCount}名 登録済み`,
    },
    {
      href: `/competition/${competitionId}/admin/judges`,
      icon: Clipboard,
      title: "審判登録",
      description: `${judgeCount}名 設定済み`,
    },
    {
      href: `/competition/${competitionId}/admin/run`,
      icon: Play,
      title: "競技進行",
      description: perfStats.total > 0 ? `${perfStats.confirmed}/${perfStats.total} 完了` : "選手登録後に利用可能",
    },
  ];

  const shareLinks = [
    { path: "/results", label: "成績速報ページ", icon: BarChart3, key: "results" },
    { path: "/scoreboard", label: "掲示板モード", icon: Monitor, key: "scoreboard" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-navy-900 mb-1">管理ダッシュボード</h1>
      <p className="text-sm text-navy-500 mb-6">{competition?.name}</p>

      {/* Status control */}
      <div className="bg-white rounded-xl border border-navy-200 p-4 mb-6">
        <div className="text-sm font-medium text-navy-700 mb-2">大会ステータス</div>
        <div className="flex gap-2">
          {([
            { value: "upcoming", label: "開催予定" },
            { value: "in_progress", label: "開催中" },
            { value: "completed", label: "終了" },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                competition?.status === value
                  ? value === "in_progress"
                    ? "bg-red-600 text-white"
                    : "bg-accent text-white"
                  : "bg-navy-100 text-navy-600 hover:bg-navy-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-navy-200 p-3 text-center">
          <div className="text-2xl font-bold text-navy-900">{athleteCount}</div>
          <div className="text-xs text-navy-500">選手</div>
        </div>
        <div className="bg-white rounded-xl border border-navy-200 p-3 text-center">
          <div className="text-2xl font-bold text-navy-900">{judgeCount}</div>
          <div className="text-xs text-navy-500">審判</div>
        </div>
        <div className="bg-white rounded-xl border border-navy-200 p-3 text-center">
          <div className="text-2xl font-bold text-accent">
            {perfStats.total > 0 ? `${perfStats.confirmed}/${perfStats.total}` : "-"}
          </div>
          <div className="text-xs text-navy-500">進行状況</div>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-3 mb-6">
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

      {/* Share links */}
      <div className="bg-white rounded-xl border border-navy-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="w-4 h-4 text-accent" />
          <h3 className="font-medium text-navy-900">共有リンク</h3>
        </div>
        <p className="text-xs text-navy-500 mb-3">観客・関係者にシェアできるURLです</p>
        <div className="space-y-2">
          {shareLinks.map((link) => (
            <div
              key={link.key}
              className="flex items-center gap-3 p-3 bg-navy-50 rounded-lg"
            >
              <link.icon className="w-4 h-4 text-navy-500" />
              <span className="flex-1 text-sm text-navy-700">{link.label}</span>
              <button
                onClick={() => copyLink(link.path, link.key)}
                className="flex items-center gap-1 px-3 py-1 bg-white border border-navy-200 rounded text-xs font-medium text-navy-600 hover:bg-navy-100 transition-colors"
              >
                {copiedKey === link.key ? (
                  <><Check className="w-3 h-3 text-green-600" /> コピー済み</>
                ) : (
                  <><Copy className="w-3 h-3" /> URLをコピー</>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
