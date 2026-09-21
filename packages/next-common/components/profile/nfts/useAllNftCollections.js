import { useEffect, useState } from "react";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";

export default function useAllNftCollections() {
  const api = useAssetHubPapi();
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    let cancelled = false;

    (async () => {
      const collectionEntries = await api.query.Nfts.Collection.getEntries({
        at: "best",
      });
      const collectionData = collectionEntries
        .sort((a, b) => Number(a.keyArgs[0]) - Number(b.keyArgs[0]))
        .map(({ keyArgs, value }) => ({
          collectionId: Number(keyArgs[0]),
          owner: value?.owner?.toString(),
          itemCount: Number(value?.items ?? 0),
        }));

      if (!cancelled) {
        setCollections(collectionData);
      }
    })().catch((error) => {
      console.error("Failed to fetch all NFT collections", error);
      if (!cancelled) {
        setCollections([]);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [api]);

  const totalItems =
    collections?.reduce((result, collection) => {
      return result + (collection.itemCount ?? 0);
    }, 0) ?? 0;

  return {
    collections,
    isLoading: api ? collections === null : true,
    totalCollections: collections?.length ?? 0,
    totalItems,
  };
}
