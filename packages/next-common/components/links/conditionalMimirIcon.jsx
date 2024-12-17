import { useState, useEffect } from "react";
import { useChain } from "../../context/chain";
import { WalletMimirLight } from "@osn/icons/subsquare";
import { usePathname } from "next/navigation";
import useMultisigAddress from "next-common/hooks/useMultisigAddress";

function useIsMultiSigAccount(address) {
  const [isMultiSigAccount, setIsMultiSigAccount] = useState(false);
  const { result, loading } = useMultisigAddress(address);

  useEffect(() => {
    if (loading) {
      return;
    }

    setIsMultiSigAccount(!!result);
  }, [loading, result]);

  return { isMultiSigAccount, loading };
}

export default function ConditionalMimirIcon({ address }) {
  const chain = useChain();
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/user");
  const { isMultiSigAccount, loading } = useIsMultiSigAccount(address);

  if (!isProfilePage || !address || loading || !isMultiSigAccount) {
    return null;
  }

  const href = `https://app.mimir.global/?address=${address}&network=${chain}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="cursor-pointer">
      <WalletMimirLight className="w-5 h-5" />
    </a>
  );
}
