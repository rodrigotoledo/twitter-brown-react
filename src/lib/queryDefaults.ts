/**
 * TanStack Query defaults for feed-style data.
 *
 * Avoids 5s polling (very heavy on the backend). Updates still happen via:
 * - query invalidation after mutations (post, like, comment, etc.)
 * - refetch when the window regains focus (only if data is stale)
 *
 * `refetchOnWindowFocus` is also set on `QueryClient` defaults in `index.tsx`;
 * we spread `feedQueryOptions` on feed queries so the behavior is obvious in each file.
 */
export const FEED_STALE_TIME_MS = 60_000;

/** Refetch when the user returns to the browser tab (still respects staleTime). */
export const feedQueryOptions = {
  refetchOnWindowFocus: true,
} as const;
