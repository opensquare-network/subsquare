import { useEffect, useMemo, useState } from "react";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";

const apiRequests = new WeakMap();

async function fetchCollectionItems(api, collectionId) {
  const entries = await api.query.Nfts.Item.getEntries(collectionId, {
    at: "best",
  });
  const items = entries
    .map(({ keyArgs, value }) => ({
      itemId: Number(keyArgs[1]),
      owner: value?.owner,
    }))
    .sort((a, b) => a.itemId - b.itemId);
  return {
    itemIds: items.map(({ itemId }) => itemId),
    itemOwners: Object.fromEntries(
      items.map(({ itemId, owner }) => [itemId, owner]),
    ),
  };
}

export default function useNftCollectionItems(collectionId, enabled) {
  const api = useAssetHubPapi();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!api || !enabled) {
      return;
    }

    if (!apiRequests.has(api)) {
      apiRequests.set(api, new Map());
    }
    const requests = apiRequests.get(api);
    let cancelled = false;
    async function loadItems() {
      try {
        if (!requests.has(collectionId)) {
          requests.set(collectionId, fetchCollectionItems(api, collectionId));
        }
        const items = await requests.get(collectionId);
        if (!cancelled) {
          setResult({ api, collectionId, items });
        }
      } catch (error) {
        requests.delete(collectionId);
        console.error(
          `Failed to fetch NFTs for collection ${collectionId}`,
          error,
        );
        if (!cancelled) {
          setResult({
            api,
            collectionId,
            items: { itemIds: [], itemOwners: {} },
          });
        }
      }
    }
    loadItems();

    return () => {
      cancelled = true;
    };
  }, [api, collectionId, enabled]);

  return useMemo(() => {
    if (result?.api === api && result?.collectionId === collectionId) {
      return result.items;
    }
    return { itemIds: null, itemOwners: {} };
  }, [api, collectionId, result]);
}
