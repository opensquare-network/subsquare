import { debounce } from "lodash-es";
import { Deferred } from "next-common/utils/deferred";
import QuickLRU from "quick-lru";

const cachedAvatars = new QuickLRU({ maxSize: 1000 });
let pendingQueries = new Map();

const delayQuery = debounce(async () => {
  const pending = pendingQueries;
  if (pending.size < 1) {
    return;
  }

  const addresses = Array.from(pending.keys());
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
      if (!pending.has(address)) {
        continue;
      }

      const { resolve } = pending.get(address);
      pending.delete(address);

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

  const pending = pendingQueries;

  if (!pending.has(address)) {
    pending.set(address, new Deferred());
    delayQuery();
  }

  return pending.get(address).promise;
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
