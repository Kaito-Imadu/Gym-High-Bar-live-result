"use client";

import { useState, useEffect } from "react";
import { getAthletes, saveAthletes } from "@/lib/store";
import { Athlete } from "@/types";
import { Plus, UserPlus, X, ArrowUp, ArrowDown, Shuffle } from "lucide-react";

export default function AthletesView({ competitionId }: { competitionId: string }) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", affiliation: "", grade: "", bio: "" });

  useEffect(() => {
    setAthletes(getAthletes(competitionId));
  }, [competitionId]);

  const persist = (updated: Athlete[]) => {
    setAthletes(updated);
    saveAthletes(competitionId, updated);
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newAthlete: Athlete = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      competitionId,
      name: form.name,
      affiliation: form.affiliation,
      grade: form.grade,
      bio: form.bio,
      startOrder: athletes.length + 1,
    };
    persist([...athletes, newAthlete]);
    setForm({ name: "", affiliation: "", grade: "", bio: "" });
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    persist(athletes.filter((a) => a.id !== id).map((a, i) => ({ ...a, startOrder: i + 1 })));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= athletes.length) return;
    const updated = [...athletes];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    persist(updated.map((a, i) => ({ ...a, startOrder: i + 1 })));
  };

  const handleShuffle = () => {
    if (athletes.length < 2) return;
    const shuffled = [...athletes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    persist(shuffled.map((a, i) => ({ ...a, startOrder: i + 1 })));
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy-900">選手登録</h1>
        <div className="flex gap-2">
          {athletes.length >= 2 && (
            <button onClick={handleShuffle} className="flex items-center gap-1.5 px-3 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200 transition-colors">
              <Shuffle className="w-4 h-4" /> シャッフル
            </button>
          )}
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors">
            <UserPlus className="w-4 h-4" /> 追加
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-navy-200 p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-navy-900">新規選手</h3>
            <button onClick={() => setShowForm(false)} className="text-navy-400 hover:text-navy-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            <input type="text" placeholder="選手名 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" autoFocus />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="所属" value={form.affiliation} onChange={(e) => setForm({ ...form, affiliation: e.target.value })} className="px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" />
              <input type="text" placeholder="学年/区分" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <input type="text" placeholder="プロフィール（任意）" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" />
            <button onClick={handleAdd} disabled={!form.name.trim()} className="w-full py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-40">追加</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
        {athletes.length > 0 && (
          <div className="px-4 py-2 bg-navy-100 text-xs text-navy-600 font-medium">演技順（矢印で並べ替え）</div>
        )}
        {athletes.map((ath, i) => (
          <div key={ath.id} className="flex items-center gap-2 px-3 py-3 border-b border-navy-100 last:border-b-0">
            <div className="flex flex-col">
              <button onClick={() => handleMove(i, -1)} disabled={i === 0} className="text-navy-300 hover:text-navy-600 disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleMove(i, 1)} disabled={i === athletes.length - 1} className="text-navy-300 hover:text-navy-600 disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
            </div>
            <div className="w-7 text-center text-sm text-navy-400 font-mono">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-navy-900 truncate">{ath.name}</div>
              <div className="text-xs text-navy-500">{[ath.affiliation, ath.grade].filter(Boolean).join(" / ") || "所属未設定"}</div>
            </div>
            <button onClick={() => handleRemove(ath.id)} className="text-navy-300 hover:text-red-500 transition-colors p-1"><X className="w-4 h-4" /></button>
          </div>
        ))}
        {athletes.length === 0 && (
          <div className="px-4 py-12 text-center text-navy-400">
            <Plus className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>選手を追加してください</p>
          </div>
        )}
      </div>
    </main>
  );
}
