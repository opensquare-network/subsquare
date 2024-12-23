import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useListPageType } from "next-common/context/page";
import { listPageCategory } from "next-common/utils/consts/business/category";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { find } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

export default function CreateFellowshipCoreMemberProposalSubmitButton({
  disabled,
  enactment,
  who,
  rank,
  action = "",
  trackName,
}) {
  const { members } = useFellowshipCoreMembers();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;
  const me = find(members, { address: realAddress });

  const myRankOk = me && me.rank >= 3;

  const api = useContextApi();
  const router = useRouter();
  const listPageType = useListPageType();
  const section = useCollectivesSection();

  const buttonDisabled = disabled || !myRankOk || !who || !rank;

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
    if (!api || buttonDisabled || !action) {
      return;
    }

    const proposal = api.tx[corePallet][action](who, rank);
    return api.tx[referendaPallet].submit(
      { FellowshipOrigins: trackName },
      { Inline: proposal.method.toHex() },
      enactment,
    );
  }, [
    api,
    buttonDisabled,
    action,
    corePallet,
    who,
    rank,
    referendaPallet,
    trackName,
    enactment,
  ]);

  return (
    <Tooltip
      content={!myRankOk && "Only available to the members with rank >= 3"}
    >
      <TxSubmissionButton
        disabled={buttonDisabled}
        title="Create Preimage"
        getTxFunc={getTxFunc}
        onInBlock={({ events }) => {
          const eventData = getEventData(events, referendaPallet, "Submitted");
          if (!eventData) {
            return;
          }
          const [referendumIndex] = eventData;
          router.push(`/${section}/referenda/${referendumIndex}`);
        }}
      />
    </Tooltip>
  );
}
