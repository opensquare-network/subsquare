import { noop } from "lodash-es";
import React, { useCallback } from "react";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";
import { useContextApi } from "next-common/context/api";
import SimpleTxPopup from "next-common/components/simpleTxPopup";

export default function ReferendumRemovalPopup({
  referendumIndex,
  onClose = noop,
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
      noSwitchSigner
    >
      <RelatedReferenda relatedReferenda={[referendumIndex]} />
    </SimpleTxPopup>
  );
}
