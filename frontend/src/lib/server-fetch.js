/**
 * Plain `fetch` for Server Components (generateMetadata, page.js data
 * fetches) — deliberately not the axios `apiClient` from `api-client.js`,
 * since that one wires in the Zustand auth store and 401 handling that
 * only make sense for client-side requests.
 *
 * Failures resolve to `null` rather than throwing: metadata/SEO fetches
 * should never be the reason a page fails to render.
 */
export async function fetchPublicJson(path) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const json = await response.json();

    return json.data ?? null;
  } catch {
    return null;
  }
}
