import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { readDotUsdAccount } from "./balanceUtils";

const EMPTY = {
  balance: null,
  transferrable: null,
  isLoading: false,
};

/**
 * Watches one account's dotUSD balance on Asset Hub. The balance is subscribed to rather
 * than fetched once, so the panel follows a transfer on the block that includes it without
 * anyone having to ask for a refresh.
 *
 * `isLoading` means "no value to show yet" rather than "a request is in flight": the amount
 * field of the transfer popup reads it that way.
 */
export default function useDotUsdBalance({ address, assetId }) {
  const papi = useAssetHubPapi();
  const [state, setState] = useState(EMPTY);

  useEffect(() => {
    // The api may still be connecting, and a client for a chain without pallet-assets would
    // throw on the read; both are "nothing to show" rather than an error.
    const canWatch =
      !!papi?.query?.Assets?.Account?.watchValue && !isNil(assetId) && !!address;

    if (!canWatch) {
      setState(EMPTY);
      return;
    }

    let isMounted = true;

    // Drop the previous value as the new subscription spins up, so a balance read for one
    // address is never shown as another's.
    setState({ ...EMPTY, isLoading: true });

    const onError = (error) => {
      console.error("Failed to watch dotUSD balance", error);

      if (isMounted) {
        setState(EMPTY);
      }
    };

    let subscription;
    try {
      subscription = papi.query.Assets.Account.watchValue(
        assetId,
        address,
        // `at` defaults to "finalized". Finality on Asset Hub trails the best block by however
        // far the relay chain's is behind, which is not a block or two: subscribing both ways
        // at once, best sat 15 blocks (~90s) ahead of finalized. That lag lands exactly when
        // the user has just transferred or minted and is watching this number. Best blocks put
        // the update in the block that included their transaction; a reorg would show a stale
        // value briefly and then correct itself.
        { at: "best" },
      ).subscribe(({ value }) => {
        if (!isMounted) {
          return;
        }

        const { balance, transferrable } = readDotUsdAccount(value);
        setState({ balance, transferrable, isLoading: false });
      }, onError);
    } catch (error) {
      onError(error);
    }

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [papi, address, assetId]);

  return state;
}
