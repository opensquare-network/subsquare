import { debounce } from "lodash-es";
import { Deferred } from "next-common/utils/deferred";
import QuickLRU from "quick-lru";

const cachedIdentities = new QuickLRU({ maxSize: 1000 });
const pendingQueries = new Map();
const processingQueries = new Map();

const delayQuery = debounce(() => {
  if (pendingQueries.size < 1) {
    return;
  }

  const idNames = [];
  for (const [idName, deferred] of pendingQueries) {
    if (processingQueries.has(idName)) {
      // Should not happen
      console.error("Duplicate identity query:", idName);
      continue;
    }
    idNames.push(idName);
    processingQueries.set(idName, deferred);
    pendingQueries.delete(idName);
  }

  const chainAddresses = {};
  const idNameSplits = idNames.map((item) => item.split("/"));
  for (const [chain, address] of idNameSplits) {
    if (!chainAddresses[chain]) {
      chainAddresses[chain] = [];
    }
    chainAddresses[chain].push(address);
  }

  for (const chain in chainAddresses) {
    const addresses = chainAddresses[chain];

    const headers = {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json;charset=UTF-8",
    };

    fetch(
      `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${chain}/short-ids`,
      {
        headers,
        method: "POST",
        body: JSON.stringify({ addresses }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        const identities = new Map(data.map((item) => [item.address, item]));

        for (const addr of addresses) {
          const idName = `${chain}/${addr}`;

          if (!processingQueries.has(idName)) {
            // Should not happen
            console.error("Identity query deferred not found:", idName);
            continue;
          }

          const { resolve } = processingQueries.get(idName);
          processingQueries.delete(idName);

          const identity = identities.get(addr) || null;
          cachedIdentities.set(idName, identity);
          if (resolve) {
            resolve(identity);
          }
        }
      })
      .catch(() => {});
  }
}, 0);

export function fetchIdentity(chain, address) {
  if (!chain || !address) {
    return Promise.resolve(null);
  }

  const idName = `${chain}/${address}`;

  if (cachedIdentities.has(idName)) {
    return Promise.resolve(cachedIdentities.get(idName));
  }

  if (processingQueries.has(idName)) {
    return processingQueries.get(idName).promise;
  }

  if (pendingQueries.has(idName)) {
    return pendingQueries.get(idName).promise;
  }

  const deferred = new Deferred();
  pendingQueries.set(idName, deferred);
  delayQuery();
  return deferred.promise;
}

/**
 * @description sync, get identity from cache
 */
export function getCachedIdentity(chain, address) {
  if (!chain || !address) {
    return null;
  }

  const idName = `${chain}/${address}`;
  return cachedIdentities.get(idName) || null;
}

export const getIdentity = getCachedIdentity;

export const clearCachedIdentitys = (list, clearPending = false) => {
  list.forEach((item) => {
    if (!item.chain || !item.address) {
      return;
    }

    const idName = `${item.chain}/${item.address}`;
    cachedIdentities.delete(idName);
    if (clearPending) {
      pendingQueries.delete(idName);
    }
  });
};
