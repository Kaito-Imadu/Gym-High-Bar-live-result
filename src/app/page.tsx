"use client";

import Link from "next/link";
import Header from "@/components/Header";
import HighBarIcon from "@/components/HighBarIcon";
import { mockCompetitions } from "@/lib/mock-data";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

const statusLabel: Record<string, { text: string; color: string }> = {
  upcoming: { text: "開催予定", color: "bg-navy-200 text-navy-700" },
  in_progress: { text: "開催中", color: "bg-red-100 text-red-700" },
  completed: { text: "終了", color: "bg-navy-100 text-navy-500" },
};

export default function HomePage() {
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

        {/* Competition list */}
        <h2 className="text-lg font-bold text-navy-800 mb-4">大会一覧</h2>
        <div className="space-y-3">
          {mockCompetitions.map((comp) => {
            const status = statusLabel[comp.status];
            return (
              <Link
                key={comp.id}
                href={`/competition/${comp.id}/results`}
                className="block bg-white rounded-xl border border-navy-200 p-4 hover:border-accent hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
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
                  <ChevronRight className="w-5 h-5 text-navy-400 group-hover:text-accent transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
