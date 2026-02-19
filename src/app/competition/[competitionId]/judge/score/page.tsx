"use client";

import { use, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getPerformancesWithDetails, getCompetition } from "@/lib/mock-data";
import { JudgeRole } from "@/types";
import { Send, CheckCircle2, User } from "lucide-react";
import LiveBadge from "@/components/LiveBadge";

function ScoreInputD({ onSubmit }: { onSubmit: (score: number) => void }) {
  const [value, setValue] = useState("");
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">
        Dスコア (難度点)
      </label>
      <input
        type="number"
        step="0.1"
        min="0"
        max="10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-3 text-2xl font-mono text-center border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
        placeholder="0.0"
      />
      <button
        onClick={() => {
          const num = parseFloat(value);
          if (!isNaN(num) && num >= 0 && num <= 10) onSubmit(num);
        }}
        className="w-full mt-3 py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark transition-colors"
      >
        <Send className="w-4 h-4" />
        送信
      </button>
    </div>
  );
}

function ScoreInputE({ onSubmit }: { onSubmit: (score: number) => void }) {
  const [value, setValue] = useState("");
  const presets = [7.5, 7.8, 8.0, 8.2, 8.5, 8.8, 9.0, 9.2, 9.5];

  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">
        Eスコア (実施点)
      </label>
      <input
        type="number"
        step="0.05"
        min="0"
        max="10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-3 text-2xl font-mono text-center border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent mb-3"
        placeholder="0.000"
      />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValue(p.toFixed(1))}
            className="py-2 bg-navy-100 rounded-lg font-mono text-sm hover:bg-navy-200 transition-colors"
          >
            {p.toFixed(1)}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          const num = parseFloat(value);
          if (!isNaN(num) && num >= 0 && num <= 10) onSubmit(num);
        }}
        className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark transition-colors"
      >
        <Send className="w-4 h-4" />
        送信
      </button>
    </div>
  );
}

function ScoreInputND({ onSubmit }: { onSubmit: (score: number) => void }) {
  const [value, setValue] = useState("0");
  const presets = [0, 0.1, 0.3, 0.5];

  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-2">
        ND (ニュートラルディダクション)
      </label>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValue(p.toFixed(1))}
            className={`py-3 rounded-lg font-mono text-lg transition-colors ${
              parseFloat(value) === p
                ? "bg-red-600 text-white"
                : "bg-navy-100 hover:bg-navy-200"
            }`}
          >
            {p === 0 ? "なし" : `-${p.toFixed(1)}`}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          const num = parseFloat(value);
          if (!isNaN(num)) onSubmit(num);
        }}
        className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent-dark transition-colors"
      >
        <Send className="w-4 h-4" />
        送信
      </button>
    </div>
  );
}

function JudgeScoreContent({ competitionId }: { competitionId: string }) {
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") ?? "E1") as JudgeRole;
  const competition = getCompetition(competitionId);
  const performances = getPerformancesWithDetails(competitionId);
  const [submitted, setSubmitted] = useState(false);

  const currentPerf = useMemo(
    () => performances.find((p) => p.isCurrent),
    [performances]
  );

  const handleSubmit = (score: number) => {
    console.log(`Judge ${role} submitted score: ${score}`);
    setSubmitted(true);
  };

  const isD = role.startsWith("D");
  const isE = role.startsWith("E");
  const isND = role === "ND";

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-bold">
            {role}
          </span>
          {competition?.status === "in_progress" && <LiveBadge />}
        </div>
      </div>

      {currentPerf ? (
        <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-navy-400" />
            <span className="text-xs text-navy-500 uppercase tracking-wider">
              現在の演技者
            </span>
          </div>
          <div className="text-xl font-bold text-navy-900 mb-1">
            {currentPerf.athlete.name}
          </div>
          <div className="text-sm text-navy-500">
            {currentPerf.athlete.affiliation} / {currentPerf.athlete.grade}
          </div>
        </div>
      ) : (
        <div className="bg-navy-100 rounded-xl p-6 text-center text-navy-500 mb-4">
          演技者を待っています...
        </div>
      )}

      {currentPerf && !submitted && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-4">
          {isD && <ScoreInputD onSubmit={handleSubmit} />}
          {isE && <ScoreInputE onSubmit={handleSubmit} />}
          {isND && <ScoreInputND onSubmit={handleSubmit} />}
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <div className="text-green-800 font-medium">スコアを送信しました</div>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-sm text-accent hover:underline"
          >
            修正する
          </button>
        </div>
      )}
    </main>
  );
}

export default function JudgeScorePage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);

  return (
    <Suspense fallback={<div className="p-8 text-center text-navy-400">読み込み中...</div>}>
      <JudgeScoreContent competitionId={competitionId} />
    </Suspense>
  );
}
