import { debounce, isEmpty } from "lodash-es";
import { Deferred } from "next-common/utils/deferred";
import QuickLRU from "quick-lru";
import { backendApi } from "next-common/services/nextApi";
import getChainSettings from "next-common/utils/consts/settings";

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

/**
 * @description sync, get bounty identity from cache
 */
export function getCachedBountyIdentity(chain, address) {
  if (!chain || !address) {
    return null;
  }

  const bountyIdName = `bounty/${chain}/${address}`;
  return cachedIdentities.get(bountyIdName) || null;
}

export const getIdentity = getCachedIdentity;

export const clearCachedIdentitys = (list, clearPending = false) => {
  list.forEach((item) => {
    if (!item.chain || !item.address) {
      return;
    }

    const idName = `${item.chain}/${item.address}`;
    const bountyIdName = `bounty/${item.chain}/${item.address}`;

    cachedIdentities.delete(idName);
    cachedIdentities.delete(bountyIdName);

    if (clearPending) {
      pendingQueries.delete(idName);
    }
  });
};

export async function fetchBountyIdentity(chain, address) {
  if (!chain || !address) {
    return null;
  }

  const { bountyIdentity } = getChainSettings(chain);
  if (!bountyIdentity) {
    return null;
  }

  const bountyIdName = `bounty/${chain}/${address}`;

  if (cachedIdentities.has(bountyIdName)) {
    return cachedIdentities.get(bountyIdName);
  }

  try {
    const { result: bountyInfo } = await backendApi.fetch(
      `treasury/addresses/${address}`,
    );

    let identity = null;
    if (!isEmpty(bountyInfo)) {
      let identityInfo = null;

      if (bountyInfo?.type === "bounty") {
        identityInfo = {
          display: `Bounty-${bountyInfo.bountyIndex}`,
          status: "NONE",
          tooltip: `Address of bounty #${bountyInfo.bountyIndex}`,
        };
      }

      if (bountyInfo?.type === "childBounty") {
        identityInfo = {
          display: `Child Bounty-${bountyInfo.parentBountyId}-${bountyInfo.index}`,
          status: "NONE",
          tooltip: `Address of child bounty #${bountyInfo.index} under parent bounty #${bountyInfo.parentBountyId}`,
        };
      }

      if (identityInfo) {
        identity = {
          info: identityInfo,
        };
      }
    }

    cachedIdentities.set(bountyIdName, identity);
    return identity;
  } catch (error) {
    console.error("Failed to fetch bounty identity info:", error);
    return null;
  }
}
