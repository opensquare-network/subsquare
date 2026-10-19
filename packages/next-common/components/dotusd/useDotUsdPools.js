import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import {
  getAssetHubPapi,
  getAssetHubPapiClient,
} from "next-common/utils/assetHub";
import { fetchDotUsdPools } from "./poolUtils";

export default function useDotUsdPools() {
  const { symbol: dotSymbol, decimals: dotDecimals } = useChainSettings();
  const [state, setState] = useState({ pools: [], isLoading: true });

  useEffect(() => {
    let isMounted = true;

    getAssetHubPapi()
      .then((api) =>
        fetchDotUsdPools(api, {
          dotSymbol,
          dotDecimals,
          clientPromise: getAssetHubPapiClient().catch(() => null),
        }),
      )
      .then((pools) => {
        if (isMounted) {
          setState({ pools, isLoading: false });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch the dotUSD pools", error);

        if (isMounted) {
          setState({ pools: [], isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dotSymbol, dotDecimals]);

  return state;
}
