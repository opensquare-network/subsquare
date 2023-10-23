import VoteStatus from "components/referenda/popup/voteStatus";

export default function SplitAbstainVoteStatus({ votes }) {
  return (
    <VoteStatus
      votes={votes}
      status={"SplitAbstain"}
      tooltip={"Vote for both aye, nay and abstain"}
    />
  );
}
