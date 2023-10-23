import VoteStatus from "./voteStatus";

export default function SplitVoteStatus({ votes }) {
  return (
    <VoteStatus
      votes={votes}
      status={"Split"}
      tooltip={"Vote for both aye and nay"}
    />
  );
}
