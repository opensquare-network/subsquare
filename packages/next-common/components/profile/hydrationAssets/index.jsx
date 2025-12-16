import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useChainSettings } from "next-common/context/chain";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

// TODO
export function useHasHydrationAssets() {
  const chainSettings = useChainSettings();
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/user");

  return useMemo(() => {
    return chainSettings?.ecoAssets?.hydration && isProfilePage;
  }, [chainSettings, isProfilePage]);
}

// TODO
export default function ProfileHydrationAssets() {
  const hasHydrationAssets = useHasHydrationAssets();

  if (!hasHydrationAssets) {
    return null;
  }

  return <SecondaryCard>hydration assets</SecondaryCard>;
}
