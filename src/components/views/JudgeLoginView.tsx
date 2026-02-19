"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getJudgePanels } from "@/lib/store";
import { JudgePanel, JudgeRole } from "@/types";
import { Lock } from "lucide-react";

export default function JudgeLoginView({ competitionId }: { competitionId: string }) {
  const router = useRouter();
  const [judges, setJudges] = useState<JudgePanel[]>([]);
  const [selectedRole, setSelectedRole] = useState<JudgeRole | "">("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { setJudges(getJudgePanels(competitionId)); }, [competitionId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { setError("役割を選択してください"); return; }
    if (!password) { setError("パスワードを入力してください"); return; }
    router.push(`/competition/${competitionId}/judge/score?role=${selectedRole}`);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-6">
        <div className="flex items-center gap-2 mb-6"><Lock className="w-5 h-5 text-accent" /><h1 className="text-xl font-bold text-navy-900">審判ログイン</h1></div>
        {judges.length === 0 ? (
          <div className="text-center py-6 text-navy-400"><p>審判が登録されていません</p><p className="text-sm mt-1">管理画面で審判を登録してください</p></div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">役割を選択</label>
              <div className="grid grid-cols-3 gap-2">
                {judges.map((judge) => (
                  <button key={judge.role} type="button" onClick={() => setSelectedRole(judge.role)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedRole === judge.role ? "bg-accent text-white border-accent" : "bg-white text-navy-700 border-navy-200 hover:border-accent"}`}>
                    <div>{judge.role}</div>
                    <div className="text-xs opacity-70 truncate">{judge.judgeName}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">パスワード</label>
              <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent" placeholder="審判パスワード" />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors">ログイン</button>
          </form>
        )}
      </div>
    </main>
  );
}
