import VoteValue from "./voteValue";

export default function SplitVote({
  isLoading,
  ayeInputVoteBalance,
  setAyeInputVoteBalance,
  nayInputVoteBalance,
  setNayInputVoteBalance,
}) {
  return (
    <>
      <VoteValue
        title="Aye Vote Value"
        titleTooltip=""
        isLoading={isLoading}
        inputVoteBalance={ayeInputVoteBalance}
        setInputVoteBalance={setAyeInputVoteBalance}
      />
      <VoteValue
        title="Nay Vote Value"
        titleTooltip=""
        isLoading={isLoading}
        inputVoteBalance={nayInputVoteBalance}
        setInputVoteBalance={setNayInputVoteBalance}
      />
    </>
  );
}
