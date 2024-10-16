import React from "react";
import { useCallback } from "react";
import { noop } from "lodash-es";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";

export default function RemoveDemocracyVotePopup({
  referendumIndex,
  onClose,
  onInBlock = noop,
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.democracy.removeVote(referendumIndex);
  }, [api, referendumIndex]);

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
