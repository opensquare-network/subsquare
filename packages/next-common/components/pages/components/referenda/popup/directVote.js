import Delegations from "./delegations";
import VoteValue from "./voteValue";
import Conviction from "./conviction";
import ReUseLocks from "next-common/components/vote/reUseLocks";

export default function DirectVote({
  module,
  isAye = true,
  addressVoteDelegations,
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
  voteLock,
  setVoteLock,
  showReUseLocks = false,
}) {
  const delegationsVotes = addressVoteDelegations?.votes;

  return (
    <>
      {delegationsVotes ? (
        <Delegations delegationsVotes={delegationsVotes} />
      ) : null}
      <div className="space-y-2">
        <VoteValue
          title={isAye ? "Aye Vote Value" : "Nay Vote Value"}
          isLoading={isLoading}
          inputVoteBalance={inputVoteBalance}
          setInputVoteBalance={setInputVoteBalance}
        />
        {showReUseLocks && (
          <ReUseLocks
            reUseGovLocks={setInputVoteBalance}
            reUseAllLocks={setInputVoteBalance}
          />
        )}
      </div>
      <Conviction
        balance={inputVoteBalance}
        module={module}
        voteLock={voteLock}
        setVoteLock={setVoteLock}
      />
    </>
  );
}
