import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useContextPapiApi } from "next-common/context/papi";
import { fetchMultisigData } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import { classifyAccountAuthority } from "./resolveAccountRole";

const EMPTY_STRUCTURE = { multisig: null, delegates: [] };

function toMultisig(multisigData, multisigAddress) {
  const signatories = multisigData?.signatories || [];
  if (signatories.length === 0) {
    return null;
  }

  return {
    multisigAddress,
    threshold: multisigData.threshold,
    signatories,
  };
}

// Resolve the authority structure of any account, i.e. who is able to
// dispatch transactions with this account as the origin:
//
//   multisig    non-null when the account itself is a multisig account
//   delegates   accounts in `Proxy.Proxies(address)` allowed to act for the
//               account (a pure proxy account delegates to its creator), each
//               carrying its own multisig info when the delegate is a multisig
//
// The returned object also spreads the classification from
// classifyAccountAuthority (isSimple / isMultisigAccount / isPureProxy /
// isPureProxyToMultisig / hasProxyDelegate / controllingMultisig), so callers
// get the full picture of the address in one place.
//
// This hook is user-agnostic; combine it with resolveAccountRole to decide
// how a specific connected account may dispatch a call for this origin.
export default function useAccountAuthority(address) {
  const papi = useContextPapiApi();
  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState(EMPTY_STRUCTURE);

  useEffect(() => {
    if (isNil(address)) {
      setStructure(EMPTY_STRUCTURE);
      setLoading(false);
      return;
    }

    if (!papi) {
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function loadAccountAuthority() {
      const [selfMultisigData, proxiesData] = await Promise.all([
        fetchMultisigData(address),
        papi.query.Proxy.Proxies.getValue(address).catch(() => null),
      ]);

      const proxies = proxiesData?.[0] || [];
      const delegates = await Promise.all(
        proxies.map(async (proxy) => {
          const delegate = proxy?.delegate;
          const delegateMultisigData = await fetchMultisigData(delegate);

          return {
            delegate,
            multisig: toMultisig(delegateMultisigData, delegate),
          };
        }),
      );

      if (cancelled) {
        return;
      }

      setStructure({
        multisig: toMultisig(selfMultisigData, address),
        delegates,
      });
      setLoading(false);
    }

    loadAccountAuthority();

    return () => {
      cancelled = true;
    };
  }, [address, papi]);

  return useMemo(
    () => ({ loading, ...structure, ...classifyAccountAuthority(structure) }),
    [loading, structure],
  );
}
