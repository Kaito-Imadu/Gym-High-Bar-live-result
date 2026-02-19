"use client";

import { use, useState } from "react";
import { getAthletes } from "@/lib/mock-data";
import { Athlete } from "@/types";
import { Plus, UserPlus, X, GripVertical } from "lucide-react";

export default function AthletesPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const initialAthletes = getAthletes(competitionId);
  const [athletes, setAthletes] = useState<Athlete[]>(initialAthletes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", affiliation: "", grade: "", bio: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newAthlete: Athlete = {
      id: `ath-new-${Date.now()}`,
      competitionId,
      name: form.name,
      affiliation: form.affiliation,
      grade: form.grade,
      bio: form.bio,
      startOrder: athletes.length + 1,
    };
    setAthletes([...athletes, newAthlete]);
    setForm({ name: "", affiliation: "", grade: "", bio: "" });
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    setAthletes(athletes.filter((a) => a.id !== id));
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy-900">選手管理</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          選手追加
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-navy-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">新規選手</h3>
            <button onClick={() => setShowForm(false)} className="text-navy-400 hover:text-navy-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="選手名 *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="所属"
                value={form.affiliation}
                onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
                className="px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="学年/区分"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <input
              type="text"
              placeholder="プロフィール"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={handleAdd}
              className="w-full py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
            >
              追加
            </button>
          </div>
        </div>
      )}

      {/* Athlete list */}
      <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
        {athletes.map((ath, i) => (
          <div
            key={ath.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-navy-100 last:border-b-0"
          >
            <GripVertical className="w-4 h-4 text-navy-300" />
            <div className="w-6 text-center text-sm text-navy-500 font-mono">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-navy-900 truncate">{ath.name}</div>
              <div className="text-xs text-navy-500">{ath.affiliation} / {ath.grade}</div>
            </div>
            <button
              onClick={() => handleRemove(ath.id)}
              className="text-navy-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {athletes.length === 0 && (
          <div className="px-4 py-8 text-center text-navy-400">
            <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            選手を追加してください
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-navy-400 text-center">
        ※ モックモード: 変更はページ更新で初期化されます
      </p>
    </main>
  );
}
