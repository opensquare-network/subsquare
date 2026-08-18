export const WIKI_SEARCH_TYPE = "Wiki";
export const WIKI_ORIGIN = "https://wiki.polkadot.com";

export function getWikiHref(location) {
  if (typeof location !== "string" || !location.trim()) {
    return null;
  }

  try {
    const url = new URL(location, `${WIKI_ORIGIN}/`);
    if (url.origin !== WIKI_ORIGIN) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function normalizeWikiResults(items = []) {
  return items
    .filter((doc) => doc && typeof doc === "object")
    .map((doc) => ({
      location: doc.location,
      href: getWikiHref(doc.location),
      title: doc.title || "-",
      content: doc.content || "-",
    }));
}
