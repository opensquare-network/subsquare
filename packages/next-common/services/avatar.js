import { debounce } from "lodash-es";
import { Deferred } from "next-common/utils/deferred";
import QuickLRU from "quick-lru";

const cachedAvatars = new QuickLRU({ maxSize: 1000 });
const sessionDataCache = new Map();
let pendingQueries = new Map();

const delayQuery = debounce(async () => {
  const currentPendingSnapshot = pendingQueries;
  pendingQueries = new Map();

  if (currentPendingSnapshot.size === 0) {
    return;
  }

  const addressesInSnapshot = Array.from(currentPendingSnapshot.keys());
  const addressesToQueryAPI = [];
  const addressesToResolveFromSessionCache = [];

  for (const address of addressesInSnapshot) {
    if (sessionDataCache.has(address)) {
      addressesToResolveFromSessionCache.push(address);
    } else {
      addressesToQueryAPI.push(address);
    }
  }

  for (const address of addressesToResolveFromSessionCache) {
    const deferred = currentPendingSnapshot.get(address);
    if (deferred) {
      const avatarData = sessionDataCache.get(address);
      cachedAvatars.set(address, avatarData);
      deferred.resolve(avatarData);
    }
  }

  if (addressesToQueryAPI.length === 0) {
    return;
  }

  const headers = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json;charset=UTF-8",
  };

  try {
    const res = await fetch("/api/avatars", {
      headers,
      method: "POST",
      body: JSON.stringify({ addresses: addressesToQueryAPI }),
    });
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    const avatarsFromAPI = new Map(
      data.map((item) => [item.address, item.avatarCid]),
    );

    for (const address of addressesToQueryAPI) {
      const deferred = currentPendingSnapshot.get(address);
      if (!deferred) continue;

      const avatar = avatarsFromAPI.get(address) || null;
      sessionDataCache.set(address, avatar);
      cachedAvatars.set(address, avatar);
      deferred.resolve(avatar);
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

  if (sessionDataCache.has(address)) {
    const avatarData = sessionDataCache.get(address);
    cachedAvatars.set(address, avatarData);
    return Promise.resolve(avatarData);
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

  return cachedAvatars.get(address) ?? null;
}

export function removeCachedAvatar(address) {
  if (cachedAvatars.has(address)) {
    cachedAvatars.delete(address);
  }
  if (sessionDataCache.has(address)) {
    sessionDataCache.delete(address);
  }
}

export const getAvatar = getCachedAvatar;
