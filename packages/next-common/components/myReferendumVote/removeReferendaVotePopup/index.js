import React, { useCallback } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function RemoveReferendaVotePopup({
  trackId,
  referendumIndex,
  onClose,
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.convictionVoting.removeVote(trackId, referendumIndex);
  }, [api, trackId, referendumIndex]);

  return (
    <SimpleTxPopup
      title="Remove Vote"
      getTxFunc={getTxFunc}
      onClose={onClose}
    />
  );
}
