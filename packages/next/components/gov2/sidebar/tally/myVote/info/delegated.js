import { useSharedDelegatingTargetReferendumVote } from "next-common/context/referenda/myVote/delegating";
import { useOnchainData } from "next-common/context/post";
import DelegatingVotePanel from "./delegatingPanel";

export default function DelegatedVotePanel({ delegating }) {
  const [targetVote] = useSharedDelegatingTargetReferendumVote();
  const { referendumIndex } = useOnchainData();
  if (!targetVote || !targetVote.isCasting) {
    return null;
  }
  const casting = targetVote.asCasting;
  const voteItem = casting.votes.find(
    (item) => item[0].toNumber() === referendumIndex,
  );
  if (!voteItem) {
    return null;
  }

  const vote = voteItem[1];
  if (!vote.isStandard) {
    return null;
  }
  const balance = delegating.balance.toString();
  const conviction = delegating.conviction.toNumber();

  return (
    <DelegatingVotePanel
      target={delegating.target.toString()}
      balance={balance}
      conviction={conviction}
      aye={vote.asStandard.vote.isAye}
    />
  );
}
