import Delegations from "./delegations";
import VoteValue from "./voteValue";
import VoteLock from "./voteLock";

export default function DirectVote({
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
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
      />
      <VoteLock voteLock={voteLock} setVoteLock={setVoteLock} />
    </>
  );
}
