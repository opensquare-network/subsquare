import { useOnchainData } from "next-common/context/post";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import DelegatingVotePanel from "./delegatingPanel";

export default function MyDelegatingVote({ delegating }) {
  const target = delegating.target.toString();
  const { referendumIndex } = useOnchainData();

  const { result: votingOf, loading } = useSubStorage(
    "democracy",
    "votingOf",
    target,
  );

  if (loading || !votingOf || votingOf.isDelegating) {
    return null;
  }

  const direct = votingOf.asDirect;
  const voteItem = direct.votes.find(
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
