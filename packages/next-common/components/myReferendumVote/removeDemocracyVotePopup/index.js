import React from "react";
import { useCallback } from "react";
import { noop } from "lodash-es";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
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
    <SignerPopupV2
      title="Remove Vote"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    />
  );
}
