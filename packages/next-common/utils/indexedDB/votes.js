import localForage from "localforage";

export const storageMap = new Map();

export const STORAGE_NAMES = {
  REFERENDA_CALLS: "referenda-calls",
  REFERENDA_ALL_VOTES: "referenda-all-votes",
};

export const STORAGE_ITEM_KEY = {
  ALLAYE: "Aye",
  ALLNAY: "Nay",
  ALLABSTAIN: "Abstain",
  ALLVOTES: "AllVotes",
};

/**
 * @param {string} storeName
 * @returns {LocalForage | null}
 */
export function getOrCreateStorage(storeName = "") {
  if (!storeName) return null;

  if (!storageMap.get(storeName)) {
    const store = localForage.createInstance({
      name: "votes",
      storeName,
      version: 1.0,
    });
    storageMap.set(storeName, store);
  }

  return storageMap.get(storeName);
}

export function clearStorage(storeName = "") {
  const store = getOrCreateStorage(storeName);

  return store?.clear();
}
