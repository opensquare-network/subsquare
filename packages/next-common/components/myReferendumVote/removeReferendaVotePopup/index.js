import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import { useFetchVotesFromServer } from "next-common/utils/gov2/useVotesFromServer";

export default function RemoveReferendaVotePopup({
  trackId,
  referendumIndex,
  onClose,
}) {
  const api = useContextApi();
  const { fetch: fetchVotesFromServer } =
    useFetchVotesFromServer(referendumIndex);

  const getTxFunc = useCallback(async () => {
    return api.tx.convictionVoting.removeVote(trackId, referendumIndex);
  }, [api, trackId, referendumIndex]);

  const onInBlock = useCallback(() => {
    fetchVotesFromServer();
  }, [fetchVotesFromServer]);

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
