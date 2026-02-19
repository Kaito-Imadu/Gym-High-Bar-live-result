import CompetitionPage from "./CompetitionPage";

export function generateStaticParams() {
  return [{ segments: [] }];
}

export default function Page({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  return <CompetitionPage params={params} />;
}
