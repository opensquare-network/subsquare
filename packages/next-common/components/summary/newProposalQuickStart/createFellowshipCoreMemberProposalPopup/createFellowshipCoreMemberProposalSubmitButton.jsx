import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { find } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import {
  useCollectivesSection,
  useCoreFellowshipPallet,
  useRankedCollectivePallet,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";

export default function CreateFellowshipCoreMemberProposalSubmitButton({
  disabled,
  enactment,
  who,
  rank,
  action = "",
  trackName,
  checkDecisionDeposit = false,
  checkVoteAye = false,
}) {
  const { members } = useFellowshipCoreMembers();
  const signerAccount = useSignerAccount();
  const realAddress = signerAccount?.realAddress;
  const me = find(members, { address: realAddress });

  const myRankOk = me && me.rank >= 3;

  const api = useContextApi();

  const router = useRouter();
  const section = useCollectivesSection();
  const corePallet = useCoreFellowshipPallet();
  const referendaPallet = useReferendaFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();

  const buttonDisabled = disabled || !myRankOk || !who || !rank;

  const getTxFunc = useCallback(async () => {
    if (!api || buttonDisabled || !action) {
      return;
    }

    const proposal = api.tx[corePallet][action](who, rank);
    const submitTx = api.tx[referendaPallet].submit(
      { FellowshipOrigins: trackName },
      { Inline: proposal.method.toHex() },
      enactment,
    );

    const referendumCount = await api.query[referendaPallet].referendumCount();
    const targetReferendumIndex = referendumCount.toNumber();

    const optionsTxs = [
      checkDecisionDeposit &&
        api.tx[referendaPallet].placeDecisionDeposit(targetReferendumIndex),
      checkVoteAye &&
        api.tx[collectivePallet].vote(targetReferendumIndex, true),
    ].filter(Boolean);

    if (optionsTxs.length) {
      return api.tx.utility.batch([submitTx, ...optionsTxs]);
    }

    return submitTx;
  }, [
    api,
    buttonDisabled,
    action,
    corePallet,
    who,
    rank,
    referendaPallet,
    collectivePallet,
    trackName,
    enactment,
    checkDecisionDeposit,
    checkVoteAye,
  ]);

  return (
    <Tooltip
      content={!myRankOk && "Only available to the members with rank >= 3"}
    >
      <TxSubmissionButton
        // disabled={buttonDisabled}
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
