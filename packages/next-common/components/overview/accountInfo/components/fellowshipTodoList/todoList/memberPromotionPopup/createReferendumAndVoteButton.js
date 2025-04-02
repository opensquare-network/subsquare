import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useUser } from "next-common/context/user";
import SecondaryButton from "next-common/lib/button/secondary";
import useCollectiveMember from "../../hooks/useCollectiveMember";
import { useFellowshipCoreMemberProposalSubmitTx } from "next-common/hooks/fellowship/core/useFellowshipCoreMemberProposalSubmitTx";
import { useChain } from "next-common/context/chain";
import { getRetainTrackNameFromRank } from "next-common/components/fellowship/core/members/actions/approve/popup";
import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

function CreateReferendumAndVoteButtonImpl({
  address,
  referendumIndex,
  voteAye,
  children,
}) {
  const api = useContextApi();
  const chain = useChain();
  const member = useCollectiveMember(address);
  const trackName = getRetainTrackNameFromRank(chain, member?.rank);
  const collectivePallet = useRankedCollectivePallet();

  const createAndVoteTxFunc = useFellowshipCoreMemberProposalSubmitTx({
    rank: member?.rank,
    who: address,
    action: "promote",
    trackName,
    enactment: null,
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
  referendumIndex,
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
        referendumIndex={referendumIndex}
        voteAye={voteAye}
      >
        {children}
      </CreateReferendumAndVoteButtonImpl>
    </SignerPopupWrapper>
  );
}
