"use client";

import { use } from "react";
import Header from "@/components/Header";
import { getCompetition } from "@/lib/mock-data";

export default function CompetitionLayoutClient({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const competition = getCompetition(competitionId);

  return (
    <div className="min-h-screen">
      <Header
        competitionName={competition?.name}
        competitionId={competitionId}
      />
      {children}
    </div>
  );
}
