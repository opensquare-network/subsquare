import { useEffect, useState } from "react";
import { getDestinationExistentialDeposit } from "./transferAssets";

// The destination ED of the transferred asset depends on both the selected
// symbol and the destination chain:
// - Hydration: every supported asset is foreign; its per-asset ED comes from
//   the assetRegistry pallet (async query).
// - Asset Hub: DOT is the native token (balances pallet ED); USDC/USDt are
//   assets pallet assets whose min balance plays the ED role.
export default function useDestinationExistentialDeposit({
  destinationApi,
  destinationChain,
  symbol,
}) {
  const [value, setValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    if (!destinationApi) {
      setValue(null);
      return;
    }

    getDestinationExistentialDeposit({
      destinationApi,
      destinationChain,
      symbol,
    })
      .then((ed) => {
        if (!cancelled) setValue(ed);
      })
      .catch(() => {
        if (!cancelled) setValue(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [destinationApi, destinationChain, symbol]);

  return {
    value,
    isLoading,
  };
}
