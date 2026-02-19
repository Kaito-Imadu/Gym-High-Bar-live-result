"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpaRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    // Handle GitHub Pages SPA redirect
    // 404.html redirects /competition/xxx/results to /?/competition/xxx/results
    const { search } = window.location;
    if (search && search.startsWith("?/")) {
      const path = "/" + search
        .slice(2)
        .split("&")
        .shift()!
        .replace(/~and~/g, "&");
      // Clean the URL and navigate
      window.history.replaceState(null, "", window.location.pathname);
      router.replace(path);
    }
  }, [router]);

  return null;
}
