import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useListPageType } from "next-common/context/page";
import { usePopupOnClose } from "next-common/context/popup";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { getEventData } from "next-common/utils/sendTx";
import { useRouter } from "next/router";
import { useCallback } from "react";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { find } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { getTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";

export default function CreateFellowshipCoreMemberProposalSubmitButton({
  enactment,
  who,
  toRank,
}) {
  useFetchFellowshipCoreMembers();
  const members = useSelector(fellowshipCoreMembersSelector);
  const realAddress = useRealAddress();
  const me = find(members, { address: realAddress });

  const myRankOk = me && me.rank >= 3;

  const api = useContextApi();
  const onClose = usePopupOnClose();
  const router = useRouter();
  const listPageType = useListPageType();
  const trackName = getTrackNameFromRank(toRank);

  const disabled = !myRankOk || !who || !toRank;

  let corePallet;
  let referendaPallet;
  if (listPageType === listPageCategory.FELLOWSHIP_REFERENDA) {
    corePallet = "fellowshipCore";
    referendaPallet = "fellowshipReferenda";
  } else if (listPageType === listPageCategory.AMBASSADOR_REFERENDA) {
    corePallet = "ambassadorCore";
    referendaPallet = "ambassadorReferenda";
  }

  const getTxFunc = useCallback(async () => {
    if (!api || disabled) {
      return;
    }

    // TODO: fellowship template, promote fn can be retain fn
    const proposal = api.tx[corePallet].promote(who, toRank);
    return api.tx[referendaPallet].submit(
      { FellowshipOrigins: trackName },
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [api, disabled, who, toRank, corePallet, referendaPallet, enactment]);

  return (
    <Tooltip
      content={!myRankOk && "Only available to the members with rank >= 3"}
    >
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
    </Tooltip>
  );
}
