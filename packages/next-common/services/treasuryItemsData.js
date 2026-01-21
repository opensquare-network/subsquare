import { backendApi } from "next-common/services/nextApi";
import QuickLRU from "quick-lru";

const cache = new QuickLRU({
  maxSize: 1000,
});
const pendingRequests = new Map();

function getCacheKey(apiPath, index) {
  return `${apiPath}/${index}`;
}

export async function fetchTreasuryItemData(apiPath, index) {
  const cacheKey = getCacheKey(apiPath, index);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey);
  }

  const requestPromise = backendApi
    .fetch(`${apiPath}/${index}`)
    .then(({ result }) => {
      cache.set(cacheKey, result);
      pendingRequests.delete(cacheKey);
      return result;
    })
    .catch((error) => {
      pendingRequests.delete(cacheKey);
      throw error;
    });

  pendingRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

export function clearAllCache() {
  cache.clear();
  pendingRequests.clear();
}
