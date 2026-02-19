/**
 * GitHub Pages static export navigation helper.
 *
 * Because only /competition/ (no segments) is pre-generated,
 * we encode the path into a query parameter so every link
 * stays on the same pre-generated page.
 *
 *   /competition/abc123/admin  →  /competition/?p=abc123%2Fadmin
 */

function getBasePath() {
  if (typeof window === "undefined") return "";
  // In production the basePath is baked by Next.js, but for
  // manually constructed URLs we need to add it back.
  const path = window.location.pathname;
  const idx = path.indexOf("/competition");
  if (idx > 0) return path.substring(0, idx);
  // Fallback: first path segment (repo name on GitHub Pages)
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0 && segments[0] !== "competition") {
    return "/" + segments[0];
  }
  return "";
}

/**
 * Build an href that stays on the pre-generated /competition/ page.
 *
 * @param segments  e.g. "abc123/admin" or "abc123/admin/athletes"
 */
export function competitionHref(segments: string): string {
  const base = getBasePath();
  return `${base}/competition/?p=${encodeURIComponent(segments)}`;
}

/**
 * Navigate to a competition sub-page.
 * Uses window.location so the browser does a full page load to
 * the pre-generated /competition/ page.
 */
export function navigateToCompetition(segments: string): void {
  window.location.href = competitionHref(segments);
}
