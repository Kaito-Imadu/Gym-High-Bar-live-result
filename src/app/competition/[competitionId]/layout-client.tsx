"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/Header";
import { getCompetition } from "@/lib/store";

export default function CompetitionLayoutClient({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const comp = getCompetition(competitionId);
    if (comp) setName(comp.name);
  }, [competitionId]);

  return (
    <div className="min-h-screen">
      <Header competitionName={name} competitionId={competitionId} />
      {children}
    </div>
  );
}
