import styled from "styled-components";
import Loading from "next-common/components/loading";
import { WarningMessage } from "next-common/components/popup/styled";
import VoteStatusBox from "./voteStatusBox";
import NoDataStatusBox from "next-common/components/popup/noDataStatusBox";
import PopupLabel from "next-common/components/popup/label";

const CurrentVotingWrapper = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`;

const CurrentVotingLoading = styled.div`
  height: 38px;
  background: var(--neutral200);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function CurrentVote({ isLoadingVote, currentVote }) {
  return (
    <CurrentVotingWrapper>
      <PopupLabel text={"Current Voting"} />
      {isLoadingVote && (
        <CurrentVotingLoading>
          <Loading />
        </CurrentVotingLoading>
      )}
      {!isLoadingVote &&
        (currentVote ? (
          <VoteStatusBox aye={currentVote.aye} nay={currentVote.nay}>
            Voting
          </VoteStatusBox>
        ) : (
          <NoDataStatusBox text={"No voting record"} />
        ))}
      {!isLoadingVote && currentVote && (
        <WarningMessage>
          Resubmitting the vote will override the current voting record
        </WarningMessage>
      )}
    </CurrentVotingWrapper>
  );
}
