import { VotingStatusContent } from "next-common/components/popup/styled";
import PopupLabel from "next-common/components/popup/label";
import VoteStatusBox from "next-common/components/popup/voteStatusBox";

export default function SplitVoteStatus({ addressVoteDelegate }) {
  const addressVoteDelegateAye = addressVoteDelegate?.aye;

  return (
    <VotingStatusContent>
      <PopupLabel
        text={"Current voting"}
        status={"Delegate"}
        tooltip={"Vote by delegating target"}
      />
      <VoteStatusBox aye={addressVoteDelegateAye}>Voting</VoteStatusBox>
    </VotingStatusContent>
  );
}
