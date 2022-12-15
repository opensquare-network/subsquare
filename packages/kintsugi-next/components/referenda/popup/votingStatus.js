import PopupLabel from "next-common/components/popup/label";
import LoadingVotingStatus from "next-common/components/popup/loadingVotingStatus";
import NoDataStatusBox from "next-common/components/popup/noDataStatusBox";
import VoteStatus from "./voteStatus";
import { WarningMessage } from "next-common/components/popup/styled";
import Column from "next-common/components/styled/column";

export default function VotingStatus({ addressVote, addressVoteIsLoading }) {
  return (
    <div>
      <PopupLabel text={"Voting status"} />
      {addressVoteIsLoading ? (
        <LoadingVotingStatus />
      ) : addressVote ? (
        <Column gap={8}>
          <VoteStatus addressVote={addressVote} />
          <WarningMessage>
            Resubmitting the vote will override the current voting record
          </WarningMessage>
        </Column>
      ) : (
        <NoDataStatusBox text={"No voting record"} />
      )}
    </div>
  );
}
