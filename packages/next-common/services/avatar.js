import { debounce } from "lodash-es";
import { Deferred } from "next-common/utils/deferred";
import QuickLRU from "quick-lru";

const cachedAvatars = new QuickLRU({ maxSize: 1000 });
let pendingQueries = new Map();

const delayQuery = debounce(() => {
  const pending = pendingQueries;
  if (pending.size < 1) {
    return;
  }

  const addresses = Array.from(pending.keys());
  const headers = {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json;charset=UTF-8",
  };

  fetch("/api/avatars", {
    headers,
    method: "POST",
    body: JSON.stringify({ addresses }),
  })
    .then((res) => res.json())
    .then((data) => {
      const avatars = new Map(data.map((item) => [item.address, item]));

      for (const address of addresses) {
        if (!pending.has(address)) {
          continue;
        }

        const { resolve } = pending.get(address);
        pending.delete(address);

        const identity = avatars.get(address) || null;
        cachedAvatars.set(address, identity);
        if (resolve) {
          resolve(identity);
        }
      }
    })
    .catch(() => {});
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
 * @description sync, get identity from cache
 */
export function getCachedAvatar(address) {
  if (!address) {
    return null;
  }

  return cachedAvatars.get(address) || null;
}

export const getAvatar = getCachedAvatar;
