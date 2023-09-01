import Delegations from "./delegations";
import VoteValue from "./voteValue";
import Conviction from "./conviction";

export default function DirectVote({
  module,
  isAye = true,
  addressVoteDelegations,
  isLoading,
  inputVoteBalance,
  setInputVoteBalance,
  voteLock,
  setVoteLock,
}) {
  const delegationsVotes = addressVoteDelegations?.votes;

  return (
    <>
      {delegationsVotes ? (
        <Delegations delegationsVotes={delegationsVotes} />
      ) : null}
      <VoteValue
        title={isAye ? "Aye Vote Value" : "Nay Vote Value"}
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
      />
      <Conviction
        balance={inputVoteBalance}
        module={module}
        voteLock={voteLock}
        setVoteLock={setVoteLock}
      />
    </>
  );
}
