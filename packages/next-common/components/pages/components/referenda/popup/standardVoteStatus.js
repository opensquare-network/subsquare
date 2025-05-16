import VoteStatus from "./voteStatus";

export default function StandardVoteStatus({ votes }) {
  return <VoteStatus votes={votes} status={"Standard"} />;
}
