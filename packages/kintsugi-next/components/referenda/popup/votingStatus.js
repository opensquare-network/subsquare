import PopupLabel from "next-common/components/popup/label";
import LoadingVotingStatus from "./loadingVotingStatus";
import NoVotingStatus from "./noVotingStatus";
import VoteStatus from "./voteStatus";

export default function VotingStatus({ addressVote, addressVoteIsLoading, node }) {
  return (
    <div>
      <PopupLabel text={"Voting status"} />
      {
        addressVoteIsLoading ? (
          <LoadingVotingStatus />
        ) : (
          addressVote ? (
            <VoteStatus
              addressVote={addressVote}
              node={node}
            />
          ) : (
            <NoVotingStatus />
          )
        )
      }
    </div>
  );
}
