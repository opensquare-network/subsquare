import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { isNil } from "lodash-es";
import { useOnchainData } from "next-common/context/post";

export default function useShowVoteActions() {
  const { referendumIndex } = useOnchainData();
  const { referendaActions } = useChainSettings();

  return useMemo(() => {
    if (
      isNil(referendumIndex) ||
      isNil(referendaActions) ||
      isNil(referendaActions?.startFrom)
    ) {
      return false;
    }

    return referendumIndex >= referendaActions?.startFrom;
  }, [referendaActions, referendumIndex]);
}
