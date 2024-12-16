import { useState, useEffect, useCallback } from "react";
import { useChain } from "../../context/chain";
import { WalletMimirLight } from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import { usePathname } from "next/navigation";
import getMultisigApiUrl from "next-common/services/multisig/url";

// TODO: split query code.
function useIsMultiSigAccount(address) {
  const [isMultiSigAccount, setIsMultiSigAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  const chain = useChain();

  const fetchMultisigData = useCallback(async () => {
    const url = getMultisigApiUrl(chain);

    if (!address || !url) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getMultisigApiUrl(chain), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "GetMultisigAddress",
          variables: { account: address },
          query: `query GetMultisigAddress($account: String!) {
                multisigAddress(account: $account) {
                  signatories
                }
              }`,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      const { multisigAddress } = result?.data || {};

      setIsMultiSigAccount(!!multisigAddress);
    } catch (err) {
      throw new Error("Error fetching multisig data");
    } finally {
      setLoading(false);
    }
  }, [address, chain]);

  useEffect(() => {
    fetchMultisigData();
  }, [fetchMultisigData]);

  return { isMultiSigAccount, loading };
}

export default function ConditionalMimirIcon({ address }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/user");
  const { isMultiSigAccount, loading } = useIsMultiSigAccount(address);

  if (
    !isProfilePage ||
    !address ||
    loading ||
    !isMultiSigAccount ||
    !chainSettings?.multisigWallets?.mimir
  ) {
    return null;
  }

  const href = `https://app.mimir.global/?address=${address}&network${chain}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="cursor-pointer">
      <WalletMimirLight className="w-5 h-5" />
    </a>
  );
}
