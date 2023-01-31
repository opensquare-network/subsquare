import Delegations from "./delegations";
import VoteValue from "./voteValue";
import VoteLock from "./voteLock";

export default function DirectVote({
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
      <VoteLock voteLock={voteLock} setVoteLock={setVoteLock} />
    </>
  );
}
