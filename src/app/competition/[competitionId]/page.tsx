"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompetitionPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/competition/${competitionId}/results`);
  }, [competitionId, router]);

  return null;
}
