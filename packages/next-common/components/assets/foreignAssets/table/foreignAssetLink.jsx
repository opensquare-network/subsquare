import { useMemo } from "react";
import Link from "next/link";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getRelayChain } from "next-common/utils/chain";

export default function ForeignAssetLink({
  assetId,
  children,
  className,
  ...props
}) {
  const { supportForeignAssets = false } = useChainSettings();
  const chain = useChain();
  const relayChain = getRelayChain(chain);

  const link = useMemo(() => {
    return `https://assethub-${relayChain}.statescan.io/#/foreign-assets/${assetId}`;
  }, [assetId, relayChain]);

  if (!supportForeignAssets) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <Link href={link} target="_blank" className={className} {...props}>
      {children}
    </Link>
  );
}
