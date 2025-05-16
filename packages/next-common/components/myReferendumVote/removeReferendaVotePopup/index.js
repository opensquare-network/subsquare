import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import { useUpdateVotesFromServer } from "next-common/utils/gov2/useVotesFromServer";

export default function RemoveReferendaVotePopup({
  trackId,
  referendumIndex,
  onClose,
}) {
  const api = useContextApi();
  const { update } = useUpdateVotesFromServer(referendumIndex);

  const getTxFunc = useCallback(async () => {
    return api.tx.convictionVoting.removeVote(trackId, referendumIndex);
  }, [api, trackId, referendumIndex]);

  const onInBlock = useCallback(() => {
    update();
  }, [update]);

  return (
    <SimpleTxPopup
      title="Remove Vote"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
      noSwitchSigner
    />
  );
}
