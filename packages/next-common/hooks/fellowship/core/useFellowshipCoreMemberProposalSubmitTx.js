import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import {
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { useCallback } from "react";

export function useFellowshipCoreMemberProposalSubmitTx({
  rank,
  who,
  action,
  trackName,
  enactment,
  checkDecisionDeposit = false,
  checkVoteAye = false,
  voteAye = true,
} = {}) {
  const api = useContextApi();

  const corePallet = useCoreFellowshipPallet();
  const referendaPallet = useReferendaFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();

  return useCallback(async () => {
    if (!api || !action || !who || isNil(rank)) {
      return;
    }

    const proposal = api.tx[corePallet][action](who, rank);
    const submitTx = api.tx[referendaPallet].submit(
      { FellowshipOrigins: trackName }, // TODO: not working for ambassador
      { Inline: proposal.method.toHex() },
      enactment,
    );

    if (checkDecisionDeposit || checkVoteAye) {
      const referendumCount = await api.query[
        referendaPallet
      ].referendumCount();
      const targetReferendumIndex = referendumCount.toNumber();

      const optionsTxs = [
        checkDecisionDeposit &&
          api.tx[referendaPallet].placeDecisionDeposit(targetReferendumIndex),
        checkVoteAye &&
          api.tx[collectivePallet].vote(targetReferendumIndex, voteAye),
      ].filter(Boolean);

      return api.tx.utility.batch([submitTx, ...optionsTxs]);
    }

    return submitTx;
  }, [
    api,
    corePallet,
    action,
    who,
    rank,
    referendaPallet,
    trackName,
    enactment,
    checkDecisionDeposit,
    checkVoteAye,
    voteAye,
    collectivePallet,
  ]);
}
