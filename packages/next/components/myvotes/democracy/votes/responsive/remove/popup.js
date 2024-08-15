import { noop } from "lodash-es";
import React, { useCallback } from "react";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";
import { useContextApi } from "next-common/context/api";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";

export default function ReferendumRemovalPopup({
  referendumIndex,
  onClose = noop,
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.democracy.removeVote(referendumIndex);
  }, [api, referendumIndex]);

  return (
    <SignerPopupV2 title="Remove Vote" getTxFunc={getTxFunc} onClose={onClose}>
      <RelatedReferenda relatedReferenda={[referendumIndex]} />
    </SignerPopupV2>
  );
}
