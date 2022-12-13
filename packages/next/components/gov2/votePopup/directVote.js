import Delegations from "components/referenda/popup/delegations";
import VoteValue from "components/referenda/popup//voteValue";
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
