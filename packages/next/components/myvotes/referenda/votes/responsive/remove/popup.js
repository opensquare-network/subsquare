import { useCallback } from "react";
import { noop } from "lodash-es";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";
import SignerPopupV2 from "next-common/components/signerPopup/indexV2";
import { useContextApi } from "next-common/context/api";

export default function ReferendumRemovalPopup({
  trackId,
  referendumIndex,
  onClose = noop,
  onInBlock = noop,
}) {
  const api = useContextApi();

  const getTxFunc = useCallback(async () => {
    return api.tx.convictionVoting.removeVote(trackId, referendumIndex);
  }, [api, trackId, referendumIndex]);

  return (
    <SignerPopupV2
      title="Remove Vote"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
    >
      <RelatedReferenda relatedReferenda={[referendumIndex]} />
    </SignerPopupV2>
  );
}
