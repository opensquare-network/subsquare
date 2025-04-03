import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useUser } from "next-common/context/user";
import SecondaryButton from "next-common/lib/button/secondary";
import useCollectiveMember from "../../hooks/useCollectiveMember";
import { useFellowshipCoreMemberProposalSubmitTx } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import { useCallback, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { getPromoteTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/promote/popup";

function useTrackNameFromAction(action, currentMemberRank) {
  const chain = useChain();
  if (action === "approve") {
    return getRetainTrackNameFromRank(chain, currentMemberRank);
  } else if (action === "promote") {
    return getPromoteTrackNameFromRank(chain, currentMemberRank + 1);
  }

  throw new Error("Unsupported action");
}

function CreateReferendumAndVoteButtonImpl({
  address,
  referendumIndex,
  action = "promote",
  voteAye,
  children,
}) {
  const api = useContextApi();
  const member = useCollectiveMember(address);
  const trackName = useTrackNameFromAction(action, member?.rank);
  const collectivePallet = useRankedCollectivePallet();
  const [enactment] = useState({ after: 100 });

  const createAndVoteTxFunc = useFellowshipCoreMemberProposalSubmitTx({
    rank: member?.rank,
    who: address,
    action,
    trackName,
    enactment,
    checkDecisionDeposit: true,
    checkVoteAye: true,
    voteAye,
  });

  const voteTxFunc = useCallback(() => {
    return api.tx[collectivePallet].vote(referendumIndex, voteAye);
  }, [api, collectivePallet, referendumIndex, voteAye]);

  const { doSubmit: doSubmitCreateAndVote } = useTxSubmission({
    getTxFunc: createAndVoteTxFunc,
  });

  const { doSubmit: doSubmitVote } = useTxSubmission({
    getTxFunc: voteTxFunc,
  });

  return (
    <SecondaryButton
      className="p-[6px]"
      size="small"
      onClick={isNil(referendumIndex) ? doSubmitCreateAndVote : doSubmitVote}
    >
      {children}
    </SecondaryButton>
  );
}

export default function CreateReferendumAndVoteButton({
  address,
  referendumIndex,
  action,
  voteAye,
  children,
}) {
  const user = useUser();
  if (!user) {
    return null; //TODO:
  }

  return (
    <SignerPopupWrapper>
      <CreateReferendumAndVoteButtonImpl
        address={address}
        referendumIndex={referendumIndex}
        action={action}
        voteAye={voteAye}
      >
        {children}
      </CreateReferendumAndVoteButtonImpl>
    </SignerPopupWrapper>
  );
}
