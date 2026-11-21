import { useEffect, useState } from 'react';

/**
 * Live star / fork count for a public GitHub repo.
 * Fetched once per browser session (cached in sessionStorage) from the public
 * GitHub API. Until it arrives — or if the request fails or is rate-limited —
 * the verified snapshot passed in `fallback` is shown instead.
 */
export default function useRepoStats(repo, fallback) {
  const key = `gh-stats:${repo}`;
  const [stats, setStats] = useState(() => {
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) return { ...JSON.parse(cached), live: true };
    } catch {
      /* storage unavailable */
    }
    return { ...fallback, live: false };
  });

  useEffect(() => {
    if (!repo || stats.live) return undefined;
    const ctrl = new AbortController();
    fetch(`https://api.github.com/repos/${repo}`, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const next = { stars: d.stargazers_count, forks: d.forks_count };
        if (typeof next.stars !== 'number') return;
        setStats({ ...next, live: true });
        try {
          sessionStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage unavailable */
        }
      })
      .catch(() => {
        /* keep the verified snapshot */
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo]);

  return stats;
}
