import { isNil } from "lodash-es";
import { useAsync } from "react-use";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { buildPoolLocations } from "../location";

// Reads AssetConversion.Pools via polkadot.js api and indexes every pool by its
// non-native token. Each Asset Hub pool contains exactly one native token. The
// raw locations are retained because the transaction codec expects
// polkadot.js-shaped enums (`{ here: null }`, `{ x2: [...] }`).
export default function useApiPoolLocations() {
  const api = useAssetHubApi();
  const canLoad = !!api?.query?.assetConversion?.pools;
  const { value } = useAsync(async () => {
    if (!canLoad) {
      return null;
    }

    try {
      const entries = await api.query.assetConversion.pools.entries();
      return { locations: buildPoolLocations(entries), sourceApi: api };
    } catch (error) {
      console.error("Failed to fetch Asset Hub pool locations", error);
      return { locations: null, sourceApi: api };
    }
  }, [api]);

  if (isNil(value) || value.sourceApi !== api) {
    return null;
  }
  return value.locations;
}
