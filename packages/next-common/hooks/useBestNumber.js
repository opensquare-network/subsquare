import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { getRelayChainBlockNumber } from "next-common/utils/ahm";
import { useEffect, useState } from "react";

export default function useBestNumber() {
  const [bestNumber, setBestNumber] = useState();
  const api = useContextApi();
  const { assethubMigration } = useChainSettings();
  const isMigrated = assethubMigration?.migrated;

  useEffect(() => {
    if (!api) {
      return;
    }
    if (isMigrated) {
      getRelayChainBlockNumber(api).then(setBestNumber);
    } else {
      api?.derive?.chain
        ?.bestNumber?.()
        .then((result) => setBestNumber(result?.value));
    }
  }, [api, isMigrated]);

  return bestNumber;
}
