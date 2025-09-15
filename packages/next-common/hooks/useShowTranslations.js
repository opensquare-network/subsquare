import { useChainSettings } from "next-common/context/chain";
import { useMemo } from "react";
import { useDetailType } from "next-common/context/page";

export default function useShowTranslations() {
  const chainSettings = useChainSettings();
  const detailType = useDetailType();

  return useMemo(() => {
    if (!chainSettings?.translations) {
      return false;
    }

    return !!chainSettings?.translations?.[detailType];
  }, [chainSettings, detailType]);
}
