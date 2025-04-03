import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { find } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import {
  useCollectivesSection,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { useFellowshipProposalSubmissionTxFunc } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";

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

  const router = useRouter();
  const section = useCollectivesSection();
  const referendaPallet = useReferendaFellowshipPallet();

  const buttonDisabled = disabled || !myRankOk || !who || !rank;

  const getTxFunc = useFellowshipProposalSubmissionTxFunc({
    rank,
    who,
    action,
    trackName,
    enactment,
    checkDecisionDeposit,
    checkVoteAye,
  });

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
