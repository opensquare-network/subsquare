import { backendApi } from "next-common/services/nextApi";
import { gov2ReferendumsDetailApi } from "next-common/services/url";
import QuickLRU from "quick-lru";

const cache = new QuickLRU({
  maxSize: 1000,
});
const pendingRequests = new Map();

export async function fetchReferendumData(referendumIndex) {
  if (cache.has(referendumIndex)) {
    return cache.get(referendumIndex);
  }

  if (pendingRequests.has(referendumIndex)) {
    return pendingRequests.get(referendumIndex);
  }

  const requestPromise = backendApi
    .fetch(gov2ReferendumsDetailApi(referendumIndex))
    .then(({ result }) => {
      cache.set(referendumIndex, result);
      pendingRequests.delete(referendumIndex);
      return result;
    })
    .catch((error) => {
      pendingRequests.delete(referendumIndex);
      throw error;
    });

  pendingRequests.set(referendumIndex, requestPromise);
  return requestPromise;
}

export function clearAllCache() {
  cache.clear();
  pendingRequests.clear();
}
