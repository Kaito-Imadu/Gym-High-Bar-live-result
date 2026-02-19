"use client";

import { useState, useEffect, useRef } from "react";
import { getJudgePanels, saveJudgePanels } from "@/lib/store";
import { JudgePanel, JudgeRole } from "@/types";

const roleDescriptions: Record<JudgeRole, string> = {
  D1: "難度審判（主任）", D2: "難度審判",
  E1: "実施審判 1", E2: "実施審判 2", E3: "実施審判 3",
  E4: "実施審判 4", E5: "実施審判 5", E6: "実施審判 6",
  ND: "ニュートラルディダクション",
};

const sections: { title: string; roles: JudgeRole[] }[] = [
  { title: "難度審判（Dパネル）", roles: ["D1", "D2"] },
  { title: "実施審判（Eパネル）", roles: ["E1", "E2", "E3", "E4", "E5", "E6"] },
  { title: "ND審判", roles: ["ND"] },
];

export default function JudgesView({ competitionId }: { competitionId: string }) {
  const [judges, setJudges] = useState<JudgePanel[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const existing = getJudgePanels(competitionId);
    const allRoles: JudgeRole[] = ["D1", "D2", "E1", "E2", "E3", "E4", "E5", "E6", "ND"];
    const panels = allRoles.map((role) =>
      existing.find((j) => j.role === role) ?? { id: `new-${role}-${Date.now()}`, competitionId, role, judgeName: "", isChief: role === "D1" }
    );
    setJudges(panels);
  }, [competitionId]);

  const updateJudgeName = (role: JudgeRole, name: string) => {
    const updated = judges.map((j) => (j.role === role ? { ...j, judgeName: name } : j));
    setJudges(updated);
    // Debounce auto-save (500ms after last keystroke)
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveJudgePanels(competitionId, updated.filter((j) => j.judgeName.trim()));
    }, 500);
  };

  // Save on unmount if pending
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  // Also save on blur for immediate feedback
  const handleBlur = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveJudgePanels(competitionId, judges.filter((j) => j.judgeName.trim()));
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-navy-900">審判登録</h1>
        <span className="text-xs text-navy-400">自動保存</span>
      </div>
      <p className="text-sm text-navy-500 mb-4">使用する審判の名前を入力してください。空欄の役割は使用されません。</p>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-navy-200 overflow-hidden">
            <div className="px-4 py-2 bg-navy-100"><h3 className="text-sm font-medium text-navy-700">{section.title}</h3></div>
            {section.roles.map((role) => {
              const judge = judges.find((j) => j.role === role);
              return (
                <div key={role} className="flex items-center gap-3 px-4 py-3 border-b border-navy-100 last:border-b-0">
                  <span className="w-8 text-sm font-mono font-bold text-accent">{role}</span>
                  <div className="flex-1">
                    <input type="text" value={judge?.judgeName ?? ""} onChange={(e) => updateJudgeName(role, e.target.value)} onBlur={handleBlur} placeholder={roleDescriptions[role]} className="w-full px-3 py-1.5 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
