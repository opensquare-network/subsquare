import VoteStatus from "next-common/components/pages/components/referenda/popup/voteStatus";

export default function SplitAbstainVoteStatus({ votes }) {
  return (
    <VoteStatus
      votes={votes}
      status={"SplitAbstain"}
      tooltip={"Vote for both aye, nay and abstain"}
    />
  );
}
