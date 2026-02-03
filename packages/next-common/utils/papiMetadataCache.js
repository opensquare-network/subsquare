import { fromHex, toHex } from "polkadot-api/utils";
import localForage from "localforage";

const CACHE_KEY = "papi-metadata-cache";
const STORE_NAME = "papi-metadata";

const store = localForage.createInstance({
  name: "subsquare",
  storeName: STORE_NAME,
  version: 1.0,
});

export async function getMetadata(codeHash) {
  if (!codeHash) return null;
  try {
    const cached = (await store?.getItem(CACHE_KEY)) || {};
    const entry = cached?.[codeHash];
    if (!entry?.data) return null;
    return fromHex(entry.data);
  } catch (error) {
    console.error("getMetadata error", error);
    return null;
  }
}

async function addEntryToCache(codeHash, entry) {
  if (!codeHash || !entry) return;
  try {
    const cached = (await store?.getItem(CACHE_KEY)) || {};
    cached[codeHash] = {
      data: entry.data,
      time: entry.time || Date.now(),
    };
    return store?.setItem(CACHE_KEY, cached);
  } catch (error) {
    console.error("addEntryToCache error", error);
  }
}

export function setMetadata(codeHash, data) {
  if (!codeHash || !data) return;
  addEntryToCache(codeHash, {
    data: toHex(data),
    time: Date.now(),
  });
}
