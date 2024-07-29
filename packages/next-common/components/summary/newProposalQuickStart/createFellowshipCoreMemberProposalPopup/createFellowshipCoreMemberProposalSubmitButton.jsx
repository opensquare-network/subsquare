import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useListPageType } from "next-common/context/page";
import { usePopupOnClose } from "next-common/context/popup";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { getEventData } from "next-common/utils/sendTx";
import { useRouter } from "next/router";
import { useCallback } from "react";
import useTrackDetail from "../../newProposalPopup/useTrackDetail";

export default function CreateFellowshipCoreMemberProposalSubmitButton({
  trackId,
  enactment,
  who,
  toRank,
}) {
  const api = useContextApi();
  const onClose = usePopupOnClose();
  const router = useRouter();
  const track = useTrackDetail(trackId);
  const listPageType = useListPageType();
  const origin = track?.origin;

  const disabled = !who || !toRank;

  let corePallet = "fellowshipCore";
  let referendaPallet = "fellowshipReferenda";
  if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    corePallet = "ambassadorCore";
    referendaPallet = "ambassadorReferenda";
  }

  const getTxFunc = useCallback(async () => {
    if (!api || !toRank) {
      return;
    }

    // TODO: fellowship template, promote fn can be retain fn
    const proposal = api.tx[corePallet].promote(who, toRank);
    return api.tx[referendaPallet].submit(
      { FellowshipOrigins: origin },
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [api, who, referendaPallet, toRank]);

  return (
    <TxSubmissionButton
      disabled={disabled}
      title="Create Preimage"
      getTxFunc={getTxFunc}
      onClose={onClose}
      onInBlock={(events) => {
        const eventData = getEventData(events, referendaPallet, "Submitted");
        if (!eventData) {
          return;
        }
        const [referendumIndex] = eventData;
        router.push(`/${listPageType}/${referendumIndex}`);
      }}
    />
  );
}
