import { useChainSettings } from "next-common/context/chain";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function useSupportHydrationAssets() {
  const chainSettings = useChainSettings();
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/user");

  return useMemo(() => {
    return chainSettings?.ecoAssets?.hydration && isProfilePage;
  }, [chainSettings, isProfilePage]);
}
