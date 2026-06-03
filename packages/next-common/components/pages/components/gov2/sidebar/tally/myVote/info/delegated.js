import { useSharedDelegatingTargetReferendumVote } from "next-common/context/referenda/myVote/delegating";
import { useOnchainData } from "next-common/context/post";
import DelegatingVotePanel from "./delegatingPanel";

export default function DelegatedVotePanel({ delegating }) {
  const [targetVote] = useSharedDelegatingTargetReferendumVote();
  const { referendumIndex } = useOnchainData();
  if (!targetVote || targetVote.type !== "Casting") {
    return null;
  }
  const casting = targetVote.value;
  const voteItem = casting.votes.find((item) => item[0] === referendumIndex);
  if (!voteItem) {
    return null;
  }

  const vote = voteItem[1];
  if (vote.type !== "Standard") {
    return null;
  }
  const balance = delegating.balance.toString();
  const conviction = delegating.conviction;

  return (
    <DelegatingVotePanel
      target={delegating.target.toString()}
      balance={balance}
      conviction={conviction}
      aye={vote.value.vote.aye}
    />
  );
}
