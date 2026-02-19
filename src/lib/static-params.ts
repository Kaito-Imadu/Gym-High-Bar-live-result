// For static export, we need at least one param to generate pages.
// At runtime, client-side routing handles any competitionId via localStorage.
export function generateCompetitionStaticParams() {
  return [{ competitionId: "_" }];
}
