import debounce from "lodash.debounce";
import QuickLRU from "quick-lru";

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

const cachedIdentities = new QuickLRU({ maxSize: 1000 });
let pendingQueries = new Map();

const delayQuery = debounce(() => {
  const pending = pendingQueries;
  if (pending.size < 1) {
    return;
  }

  const chainAddresses = {};
  const idNames = [...pending.keys()];
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

        for (const idName of idNames) {
          if (!pending.has(idName)) {
            continue;
          }

          const { resolve } = pending.get(idName);
          pending.delete(idName);

          const [chainOfIdName, addrOfIdName] = idName.split("/");
          if (chainOfIdName !== chain) {
            continue;
          }
          const identity = identities.get(addrOfIdName) || null;
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

  const pending = pendingQueries;

  if (!pending.has(idName)) {
    pending.set(idName, new Deferred());
    delayQuery();
  }

  return pending.get(idName).promise;
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
