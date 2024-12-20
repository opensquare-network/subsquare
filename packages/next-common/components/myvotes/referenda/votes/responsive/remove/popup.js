import { useCallback } from "react";
import { noop } from "lodash-es";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
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
    <SimpleTxPopup
      title="Remove Vote"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={onInBlock}
      noSwitchSigner
    >
      <RelatedReferenda relatedReferenda={[referendumIndex]} />
    </SimpleTxPopup>
  );
}
