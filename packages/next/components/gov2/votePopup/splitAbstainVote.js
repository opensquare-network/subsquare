import VoteValue from "components/referenda/popup/voteValue";

export default function SplitAbstainVote({
  isLoading,
  ayeInputVoteBalance,
  setAyeInputVoteBalance,
  nayInputVoteBalance,
  setNayInputVoteBalance,
  abstainInputVoteBalance,
  setAbstainInputVoteBalance,
}) {
  return (
    <>
      <VoteValue
        title="Abstain Vote Value"
        titleTooltip=""
        isLoading={isLoading}
        inputVoteBalance={abstainInputVoteBalance}
        setInputVoteBalance={setAbstainInputVoteBalance}
      />
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
