import styled from "styled-components";
import { WarningMessage } from "next-common/components/popup/styled";
import VoteStatusBox from "next-common/components/popup/voteStatusBox";
import NoDataStatusBox from "next-common/components/popup/noDataStatusBox";
import PopupLabel from "next-common/components/popup/label";

const CurrentVotingWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

export default function CurrentVote({ currentVote }) {
  return (
    <CurrentVotingWrapper>
      <PopupLabel text={"Current Voting"} />
      {currentVote ? (
        <VoteStatusBox aye={currentVote[1]}>Voting</VoteStatusBox>
      ) : (
        <NoDataStatusBox text={"No voting record"} />
      )}
      {currentVote && (
        <WarningMessage>
          Resubmitting the vote will override the current voting record
        </WarningMessage>
      )}
    </CurrentVotingWrapper>
  );
}
