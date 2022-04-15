import Delegations from "./delegations";
import VoteValue from "./voteValue";
import VoteLock from "./voteLock";

export default function DirectVote({ addressVoteDelegations, isLoading, inputVoteBalance, setInputVoteBalance, voteLock, setVoteLock, node }) {
  const delegationsVotes = addressVoteDelegations?.votes;

  return (
    <>
      {delegationsVotes ? (
        <Delegations
          delegationsVotes={delegationsVotes}
          node={node}
        />
      ) : null}
      <VoteValue
        isLoading={isLoading}
        inputVoteBalance={inputVoteBalance}
        setInputVoteBalance={setInputVoteBalance}
        node={node}
      />
      <VoteLock
        voteLock={voteLock}
        setVoteLock={setVoteLock}
      />
    </>
  );
}
