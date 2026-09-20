import { useEffect, useState } from "react";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { resolveMetadataName } from "next-common/utils/nft/metadata";

/**
 * Storage shapes verified against Polkadot Asset Hub chain data (2026-09):
 *
 * Nfts.Account               NMap [account, collection(u32), item(u32)] -> () (items held)
 * Nfts.CollectionMetadataOf  map collection -> { deposit, data: Uint8Array }
 * Nfts.ItemMetadataOf        map (collection, item) -> { deposit, data: Uint8Array }
 *
 * `data` bytes carry an off-chain metadata URI (IPFS URI/CID or https URL).
 * An item id is a unique token, so the held balance of each item is always 1.
 */

const itemNamesCache = new Map();

const refreshListeners = new Set();

// Ask mounted lists to refetch, e.g. after an NFT transfer.
export function invalidateNftCollections() {
  refreshListeners.forEach((listener) => listener());
}

async function safeGetEntries(query, ...args) {
  try {
    return await query.getEntries(...args);
  } catch {
    return [];
  }
}

async function safeGetValues(query, keys) {
  try {
    return await query.getValues(keys);
  } catch {
    return [];
  }
}

function groupCollections(entries) {
  const map = new Map();

  entries.forEach(({ keyArgs }) => {
    const collectionId = Number(keyArgs[1]);
    const itemId = Number(keyArgs[2]);
    if (!map.has(collectionId)) {
      map.set(collectionId, { collectionId, itemIds: [] });
    }
    map.get(collectionId).itemIds.push(itemId);
  });

  // Item ids are little-endian in storage keys, so storage order is not numeric.
  return [...map.values()]
    .sort((a, b) => a.collectionId - b.collectionId)
    .map((collection) => ({
      ...collection,
      itemIds: collection.itemIds.sort((a, b) => a - b),
    }));
}

// Collection metadata may be unreachable (unpinned IPFS content); then fall back
// to the first item name when it looks like "<collection name> #<id>".
async function resolveCollectionDisplayName(api, collection, metadata) {
  const name = await resolveMetadataName(metadata?.data);
  if (name || !collection.itemIds.length) {
    return name;
  }

  const itemMetadatas = await safeGetValues(api.query.Nfts.ItemMetadataOf, [
    [collection.collectionId, collection.itemIds[0]],
  ]);
  const itemName = await resolveMetadataName(itemMetadatas?.[0]?.data);
  const prefix = itemName?.replace(/\s*#\d+$/, "");
  return prefix && prefix !== itemName ? prefix : null;
}

// Item ids are already known from the account query; only names need loading.
// `onName` fires as each name resolves, the returned promise resolves with all of them.
export function fetchCollectionItemNames(api, collection, onName) {
  const { collectionId, itemIds } = collection;

  if (!itemNamesCache.has(collectionId)) {
    const promise = (async () => {
      const metadatas = await safeGetValues(
        api.query.Nfts.ItemMetadataOf,
        itemIds.map((itemId) => [collectionId, itemId]),
      );

      const names = new Map();
      await Promise.all(
        itemIds.map(async (itemId, index) => {
          const name = await resolveMetadataName(metadatas?.[index]?.data);
          names.set(itemId, name);
          onName?.(itemId, name);
        }),
      );
      return names;
    })().catch(() => new Map());

    itemNamesCache.set(collectionId, promise);
  }

  return itemNamesCache.get(collectionId);
}

export default function useAccountNftCollections(address) {
  const api = useAssetHubPapi();
  const [collections, setCollections] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const listener = () => setRefreshKey((key) => key + 1);
    refreshListeners.add(listener);
    return () => {
      refreshListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    let cancelled = false;
    setCollections(null);

    (async () => {
      const entries = await safeGetEntries(api.query.Nfts.Account, address);
      const grouped = groupCollections(entries);
      if (!cancelled) {
        setCollections(grouped);
      }
      if (!grouped.length) {
        return;
      }

      const metadatas = await safeGetValues(
        api.query.Nfts.CollectionMetadataOf,
        grouped.map(({ collectionId }) => [collectionId]),
      );

      await Promise.all(
        grouped.map(async (collection, index) => {
          const name = await resolveCollectionDisplayName(
            api,
            collection,
            metadatas?.[index],
          );
          if (cancelled) {
            return;
          }
          setCollections((prev) =>
            prev?.map((item) =>
              item.collectionId === collection.collectionId
                ? { ...item, name }
                : item,
            ),
          );
        }),
      );
    })().catch((e) => {
      console.error("Failed to fetch account NFT collections", e);
    });

    return () => {
      cancelled = true;
    };
  }, [api, address, refreshKey]);

  const isLoading = api ? collections === null : true;
  const totalItems =
    collections?.reduce((result, item) => result + item.itemIds.length, 0) ?? 0;

  return { collections, isLoading, totalItems };
}
