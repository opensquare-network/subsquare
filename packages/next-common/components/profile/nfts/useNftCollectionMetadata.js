import { useEffect, useMemo, useState } from "react";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { resolveMetadataName } from "next-common/utils/nft/metadata";

export default function useNftCollectionMetadata(collections) {
  const api = useAssetHubPapi();
  const requests = useMemo(() => new Map(), []);
  const [names, setNames] = useState({});
  const collectionIds = useMemo(
    () => (collections || []).map(({ collectionId }) => collectionId),
    [collections],
  );

  useEffect(() => {
    if (!api || !collectionIds.length) {
      return;
    }

    const idsToLoad = collectionIds.filter((id) => !requests.has(id));
    if (idsToLoad.length) {
      const metadataRequest = api.query.Nfts.CollectionMetadataOf.getValues(
        idsToLoad.map((id) => [id]),
        { at: "best" },
      );
      idsToLoad.forEach((id, index) => {
        const request = (async () => {
          try {
            const metadata = await metadataRequest;
            return await resolveMetadataName(metadata?.[index]?.data);
          } catch (error) {
            requests.delete(id);
            console.error(
              `Failed to fetch NFT collection ${id} metadata`,
              error,
            );
            return null;
          }
        })();
        requests.set(id, request);
      });
    }

    let cancelled = false;
    // Cache pending requests too so quick page changes never lose a name.
    async function loadNames() {
      await Promise.all(
        collectionIds.map(async (id) => {
          const name = await requests.get(id);
          if (!cancelled) {
            setNames((previous) => ({ ...previous, [id]: name }));
          }
        }),
      );
    }
    loadNames();

    return () => {
      cancelled = true;
    };
  }, [api, collectionIds, requests]);

  return names;
}
