import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";

export default function useBestNumber() {
  const [bestNumber, setBestNumber] = useState();
  const api = useContextApi();
  const { assethubMigration } = useChainSettings();
  const isMigrated = assethubMigration?.migrated;

  if (isMigrated) {
    api?.query?.parachainSystem
      ?.validationData?.()
      .then((result) => result?.toJSON())
      .then((result) => setBestNumber(result?.relayParentNumber));
  } else {
    api?.derive?.chain
      ?.bestNumber?.()
      .then((result) => setBestNumber(result?.value));
  }

  return bestNumber;
}
