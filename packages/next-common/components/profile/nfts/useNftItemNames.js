import { useEffect, useState } from "react";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { fetchCollectionItemNames } from "./useAccountNftCollections";

export default function useNftItemNames(collectionId, itemIds) {
  const api = useAssetHubPapi();
  const [names, setNames] = useState({});
  // Once item ids are loaded, rows render at once and only their names are
  // loaded (cached per collection).
  useEffect(() => {
    if (!api || itemIds === null) {
      return;
    }

    let cancelled = false;
    const applyName = (itemId, name) => {
      if (!cancelled) {
        setNames((prev) => ({ ...prev, [itemId]: name }));
      }
    };

    fetchCollectionItemNames(api, { collectionId, itemIds }, applyName).then(
      (namesMap) => {
        if (!cancelled) {
          setNames(Object.fromEntries(namesMap));
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [api, collectionId, itemIds]);

  return names;
}
