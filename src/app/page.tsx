"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import HighBarIcon from "@/components/HighBarIcon";
import { getCompetitions, createCompetition, deleteCompetition } from "@/lib/store";
import { Competition } from "@/types";
import { Calendar, MapPin, ChevronRight, Plus, Trash2, X, Link as LinkIcon, Copy, Check } from "lucide-react";

const statusLabel: Record<string, { text: string; color: string }> = {
  upcoming: { text: "開催予定", color: "bg-navy-200 text-navy-700" },
  in_progress: { text: "開催中", color: "bg-red-100 text-red-700" },
  completed: { text: "終了", color: "bg-navy-100 text-navy-500" },
};

export default function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", venue: "" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setCompetitions(getCompetitions());
  }, []);

  const handleCreate = () => {
    if (!form.name.trim() || !form.date || !form.venue.trim()) return;
    createCompetition({
      name: form.name,
      date: form.date,
      venue: form.venue,
      status: "upcoming",
    });
    setForm({ name: "", date: "", venue: "" });
    setShowForm(false);
    setCompetitions(getCompetitions());
  };

  const handleDelete = (id: string) => {
    if (!confirm("この大会を削除しますか？関連する全データも削除されます。")) return;
    deleteCompetition(id);
    setCompetitions(getCompetitions());
  };

  const getBaseUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.origin + (window.location.pathname.replace(/\/$/, ""));
  };

  const copyLink = (path: string, compId: string) => {
    const url = `${getBaseUrl()}${path}`;
    navigator.clipboard.writeText(url);
    setCopiedId(compId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <HighBarIcon className="w-16 h-16 text-accent mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            鉄棒チャレンジカップ
          </h1>
          <p className="text-navy-500">体操競技（鉄棒）リアルタイム採点・速報システム</p>
        </div>

        {/* Create button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy-800">大会一覧</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            大会を作成
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-navy-200 p-5 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900">新しい大会を作成</h3>
              <button onClick={() => setShowForm(false)} className="text-navy-400 hover:text-navy-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">大会名 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例: 第1回 鉄棒チャレンジカップ"
                  className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">開催日 *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">会場 *</label>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    placeholder="例: 大阪市中央体育館"
                    className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim() || !form.date || !form.venue.trim()}
                className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                作成する
              </button>
            </div>
          </div>
        )}

        {/* Competition list */}
        <div className="space-y-3">
          {competitions.length === 0 && !showForm && (
            <div className="text-center py-16 text-navy-400">
              <HighBarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>まだ大会がありません</p>
              <p className="text-sm mt-1">「大会を作成」ボタンから始めましょう</p>
            </div>
          )}
          {competitions.map((comp) => {
            const status = statusLabel[comp.status] ?? statusLabel.upcoming;
            return (
              <div
                key={comp.id}
                className="bg-white rounded-xl border border-navy-200 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <h3 className="font-bold text-navy-900 truncate">{comp.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-navy-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {comp.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {comp.venue}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="text-navy-300 hover:text-red-500 transition-colors p-1"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Action links */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-navy-100">
                  <Link
                    href={`/competition/${comp.id}/admin`}
                    className="px-3 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-medium hover:bg-navy-800 transition-colors"
                  >
                    管理画面
                  </Link>
                  <Link
                    href={`/competition/${comp.id}/results`}
                    className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-medium hover:bg-accent-dark transition-colors"
                  >
                    成績速報
                  </Link>
                  <Link
                    href={`/competition/${comp.id}/scoreboard`}
                    className="px-3 py-1.5 bg-navy-700 text-white rounded-lg text-xs font-medium hover:bg-navy-600 transition-colors"
                  >
                    掲示板
                  </Link>
                  <button
                    onClick={() => copyLink(`/competition/${comp.id}/results`, comp.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-navy-100 text-navy-700 rounded-lg text-xs font-medium hover:bg-navy-200 transition-colors"
                  >
                    {copiedId === comp.id ? (
                      <><Check className="w-3 h-3 text-green-600" /> コピー済み</>
                    ) : (
                      <><Copy className="w-3 h-3" /> 速報リンクをコピー</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
