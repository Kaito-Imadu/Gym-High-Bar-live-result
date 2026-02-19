"use client";

import Link from "next/link";
import HighBarIcon from "./HighBarIcon";
import { competitionHref } from "@/lib/navigation";

interface HeaderProps {
  competitionName?: string;
  competitionId?: string;
}

export default function Header({ competitionName, competitionId }: HeaderProps) {
  return (
    <header className="bg-navy-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <HighBarIcon className="w-8 h-8 text-accent-light" />
          <span className="text-lg font-bold tracking-tight hidden sm:inline">
            鉄棒速報
          </span>
        </Link>
        {competitionName && (
          <>
            <span className="text-navy-400">/</span>
            {competitionId ? (
              <a
                href={competitionHref(`${competitionId}/results`)}
                className="text-sm sm:text-base font-medium text-navy-200 hover:text-white transition-colors truncate"
              >
                {competitionName}
              </a>
            ) : (
              <span className="text-sm sm:text-base font-medium text-navy-200 truncate">
                {competitionName}
              </span>
            )}
          </>
        )}
      </div>
    </header>
  );
}
