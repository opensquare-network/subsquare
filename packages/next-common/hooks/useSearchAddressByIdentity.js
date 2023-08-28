import { useChainSettings } from "next-common/context/chain";
import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";
import { useEffect, useMemo, useState } from "react";

export default function useSearchAddressByIdentity(
  identitySearch,
  fromAccounts,
) {
  const [identityDisplayToAddress, setIdentityDisplayToAddress] = useState({});
  const chainSettings = useChainSettings();

  useEffect(() => {
    const identityChain = chainSettings.identity;
    fromAccounts.forEach((account) => {
      fetchIdentity(identityChain, account).then((identity) => {
        const identityDisplay = getIdentityDisplay(identity);
        setIdentityDisplayToAddress((identityDisplayToAddress) => ({
          ...identityDisplayToAddress,
          [identityDisplay]: account,
        }));
      });
    });
  }, [fromAccounts, chainSettings]);

  return useMemo(() => {
    if (identitySearch) {
      return Object.keys(identityDisplayToAddress)
        .filter((display) =>
          display
            .toLocaleLowerCase()
            .includes(identitySearch.toLocaleLowerCase()),
        )
        .map((display) => identityDisplayToAddress[display]);
    }
    return [];
  }, [identitySearch, identityDisplayToAddress]);
}
