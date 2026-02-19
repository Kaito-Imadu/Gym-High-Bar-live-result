"use client";

import { use, useState } from "react";
import { getJudgePanels } from "@/lib/mock-data";
import { JudgePanel, JudgeRole } from "@/types";
import { Save } from "lucide-react";

const ALL_ROLES: JudgeRole[] = ["D1", "D2", "E1", "E2", "E3", "E4", "E5", "E6", "ND"];

const roleDescriptions: Record<JudgeRole, string> = {
  D1: "難度審判 (主任)",
  D2: "難度審判",
  E1: "実施審判 1",
  E2: "実施審判 2",
  E3: "実施審判 3",
  E4: "実施審判 4",
  E5: "実施審判 5",
  E6: "実施審判 6",
  ND: "ニュートラルディダクション",
};

export default function JudgesPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const initialJudges = getJudgePanels(competitionId);
  const [judges, setJudges] = useState<JudgePanel[]>(initialJudges);
  const [saved, setSaved] = useState(false);

  const updateJudgeName = (role: JudgeRole, name: string) => {
    setJudges((prev) => {
      const existing = prev.find((j) => j.role === role);
      if (existing) {
        return prev.map((j) => (j.role === role ? { ...j, judgeName: name } : j));
      }
      return [
        ...prev,
        {
          id: `jp-new-${role}`,
          competitionId,
          role,
          judgeName: name,
          isChief: role === "D1",
        },
      ];
    });
    setSaved(false);
  };

  const handleSave = () => {
    console.log("Saving judges:", judges);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy-900">審判設定</h1>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved
              ? "bg-green-600 text-white"
              : "bg-accent text-white hover:bg-accent-dark"
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? "保存済み" : "保存"}
        </button>
      </div>

      <div className="space-y-3">
        {/* D Judges */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <div className="px-4 py-2 bg-navy-100">
            <h3 className="text-sm font-medium text-navy-700">難度審判 (D Panel)</h3>
          </div>
          {(["D1", "D2"] as JudgeRole[]).map((role) => {
            const judge = judges.find((j) => j.role === role);
            return (
              <div key={role} className="flex items-center gap-3 px-4 py-3 border-b border-navy-100 last:border-b-0">
                <span className="w-8 text-sm font-mono font-bold text-accent">{role}</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={judge?.judgeName ?? ""}
                    onChange={(e) => updateJudgeName(role, e.target.value)}
                    placeholder={roleDescriptions[role]}
                    className="w-full px-3 py-1.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* E Judges */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <div className="px-4 py-2 bg-navy-100">
            <h3 className="text-sm font-medium text-navy-700">実施審判 (E Panel)</h3>
          </div>
          {(["E1", "E2", "E3", "E4", "E5", "E6"] as JudgeRole[]).map((role) => {
            const judge = judges.find((j) => j.role === role);
            return (
              <div key={role} className="flex items-center gap-3 px-4 py-3 border-b border-navy-100 last:border-b-0">
                <span className="w-8 text-sm font-mono font-bold text-accent">{role}</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={judge?.judgeName ?? ""}
                    onChange={(e) => updateJudgeName(role, e.target.value)}
                    placeholder={roleDescriptions[role]}
                    className="w-full px-3 py-1.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ND Judge */}
        <div className="bg-white rounded-xl border border-navy-200 overflow-hidden">
          <div className="px-4 py-2 bg-navy-100">
            <h3 className="text-sm font-medium text-navy-700">ND審判</h3>
          </div>
          {(["ND"] as JudgeRole[]).map((role) => {
            const judge = judges.find((j) => j.role === role);
            return (
              <div key={role} className="flex items-center gap-3 px-4 py-3">
                <span className="w-8 text-sm font-mono font-bold text-accent">{role}</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={judge?.judgeName ?? ""}
                    onChange={(e) => updateJudgeName(role, e.target.value)}
                    placeholder={roleDescriptions[role]}
                    className="w-full px-3 py-1.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs text-navy-400 text-center">
        ※ モックモード: 変更はページ更新で初期化されます
      </p>
    </main>
  );
}
