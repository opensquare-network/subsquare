import VoteValue from "./voteValue";
import ReUseLocks from "next-common/components/vote/reUseLocks";

export default function SplitVote({
  isLoading,
  ayeInputVoteBalance,
  setAyeInputVoteBalance,
  nayInputVoteBalance,
  setNayInputVoteBalance,
  showReUseLocks,
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
      {showReUseLocks && (
        <ReUseLocks
          reUseGovLocks={setAyeInputVoteBalance}
          reUseAllLocks={setAyeInputVoteBalance}
        />
      )}
      <VoteValue
        title="Nay Vote Value"
        titleTooltip=""
        isLoading={isLoading}
        inputVoteBalance={nayInputVoteBalance}
        setInputVoteBalance={setNayInputVoteBalance}
      />
      {showReUseLocks && (
        <ReUseLocks
          reUseGovLocks={setNayInputVoteBalance}
          reUseAllLocks={setNayInputVoteBalance}
        />
      )}
    </>
  );
}
