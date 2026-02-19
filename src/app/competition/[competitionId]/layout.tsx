import { generateCompetitionStaticParams } from "@/lib/static-params";
import CompetitionLayoutClient from "./layout-client";

export function generateStaticParams() {
  return generateCompetitionStaticParams();
}

export default function CompetitionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ competitionId: string }>;
}) {
  return (
    <CompetitionLayoutClient params={params}>
      {children}
    </CompetitionLayoutClient>
  );
}
