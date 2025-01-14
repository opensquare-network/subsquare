import VoteValue from "components/referenda/popup/voteValue";
import ReUseLocks from "next-common/components/vote/reUseLocks";

export default function SplitAbstainVote({
  isLoading,
  ayeInputVoteBalance,
  setAyeInputVoteBalance,
  nayInputVoteBalance,
  setNayInputVoteBalance,
  abstainInputVoteBalance,
  setAbstainInputVoteBalance,
  showReUseLocks,
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
      {showReUseLocks && (
        <ReUseLocks
          reUseGovLocks={setAbstainInputVoteBalance}
          reUseAllLocks={setAbstainInputVoteBalance}
        />
      )}
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
