import { useContextPapi } from "next-common/context/papi";
import { useEffect, useState } from "react";

// Give up waiting for the chain client after this delay and fall back to the
// account derived from the EVM address.
const RESOLVE_TIMEOUT = 10 * 1000;

// Returns the substrate account that registered the mapping for an EVM address
// in pallet-revive, or null if the address was never mapped. `isResolved` is
// false while the mapping is still being read from the chain.
export default function useReviveOriginalAccount(evmAddress) {
  const { api, checkPallet } = useContextPapi();
  const hasOriginalAccount = checkPallet("Revive", "OriginalAccount");
  const [state, setState] = useState({ address: null, isResolved: false });

  useEffect(() => {
    setState({ address: null, isResolved: false });

    if (!evmAddress) {
      setState({ address: null, isResolved: true });
      return;
    }

    const timer = setTimeout(() => {
      setState((prev) =>
        prev.isResolved ? prev : { address: null, isResolved: true },
      );
    }, RESOLVE_TIMEOUT);

    return () => clearTimeout(timer);
  }, [evmAddress]);

  // Kept apart from the timeout above: the papi client can be recreated while
  // reconnecting, which must not restart the pending state.
  useEffect(() => {
    if (!api || !evmAddress) {
      return;
    }

    if (!hasOriginalAccount) {
      setState({ address: null, isResolved: true });
      return;
    }

    try {
      const sub = api.query.Revive.OriginalAccount.watchValue(
        evmAddress,
      ).subscribe({
        next: ({ value }) =>
          setState({ address: value ?? null, isResolved: true }),
        error: () => setState({ address: null, isResolved: true }),
      });

      return () => sub.unsubscribe();
    } catch {
      setState({ address: null, isResolved: true });
    }
  }, [api, hasOriginalAccount, evmAddress]);

  return state;
}
