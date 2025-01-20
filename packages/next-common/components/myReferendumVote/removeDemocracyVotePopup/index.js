import React from "react";
import { useCallback } from "react";
import { noop } from "lodash-es";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import { useSharedPopupOpenState } from "next-common/context/popup/switch";

export default function RemoveDemocracyVotePopup({
  referendumIndex,
  onInBlock = noop,
}) {
  const api = useContextApi();
  const [, setSharedPopupOpen] = useSharedPopupOpenState();

  const getTxFunc = useCallback(async () => {
    return api.tx.democracy.removeVote(referendumIndex);
  }, [api, referendumIndex]);

  return (
    <SimpleTxPopup
      title="Remove Vote"
      getTxFunc={getTxFunc}
      onClose={() => setSharedPopupOpen(false)}
      onInBlock={onInBlock}
      noSwitchSigner
    />
  );
}
