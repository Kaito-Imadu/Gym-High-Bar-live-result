import { mockCompetitions } from "./mock-data";

export function generateCompetitionStaticParams() {
  return mockCompetitions.map((c) => ({
    competitionId: c.id,
  }));
}
