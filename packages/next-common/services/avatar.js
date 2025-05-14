import { debounce } from "lodash-es";
import { Deferred } from "next-common/utils/deferred";
import QuickLRU from "quick-lru";

const cachedAvatars = new QuickLRU({ maxSize: 1000 });
const pendingQueries = new Map();
const processingQueries = new Map();

const delayQuery = debounce(async () => {
  if (pendingQueries.size < 1) {
    return;
  }

  const addresses = [];
  for (const [address, deferred] of pendingQueries) {
    if (processingQueries.has(address)) {
      // Should not happen
      console.error("Duplicate avatar query:", address);
      continue;
    }
    addresses.push(address);
    processingQueries.set(address, deferred);
    pendingQueries.delete(address);
  }

  const headers = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json;charset=UTF-8",
  };

  try {
    const res = await fetch("/api/avatars", {
      headers,
      method: "POST",
      body: JSON.stringify({ addresses }),
    });
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    const avatars = new Map(data.map((item) => [item.address, item.avatarCid]));

    for (const address of addresses) {
      if (!processingQueries.has(address)) {
        // Should not happen
        console.error("Avatar query deferred not found:", address);
        continue;
      }

      const { resolve } = processingQueries.get(address);
      processingQueries.delete(address);
      const avatar = avatars.get(address) || null;
      cachedAvatars.set(address, avatar);
      if (resolve) {
        resolve(avatar);
      }
    }
  } catch (e) {
    // ignore
  }
}, 0);

export function fetchAvatar(address) {
  if (!address) {
    return Promise.resolve(null);
  }

  if (cachedAvatars.has(address)) {
    return Promise.resolve(cachedAvatars.get(address));
  }

  if (processingQueries.has(address)) {
    return processingQueries.get(address).promise;
  }

  if (pendingQueries.has(address)) {
    return pendingQueries.get(address).promise;
  }

  const deferred = new Deferred();
  pendingQueries.set(address, deferred);
  delayQuery();
  return deferred.promise;
}

/**
 * @description sync, get avatar from cache
 */
export function getCachedAvatar(address) {
  if (!address) {
    return null;
  }

  return cachedAvatars.get(address) || null;
}

export function removeCachedAvatar(address) {
  if (cachedAvatars.has(address)) {
    cachedAvatars.delete(address);
  }
}

export const getAvatar = getCachedAvatar;
