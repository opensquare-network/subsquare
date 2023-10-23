import PopupLabel from "next-common/components/popup/label";
import LoadingVotingStatus from "next-common/components/popup/loadingVotingStatus";
import { WarningMessage } from "next-common/components/popup/styled";
import VStack from "next-common/components/styled/vStack";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";

export default function VotingStatus({ addressVote, addressVoteIsLoading }) {
  return (
    <div>
      <PopupLabel text={"Voting status"} />
      {addressVoteIsLoading ? (
        <LoadingVotingStatus />
      ) : addressVote ? (
        <VStack space={8}>
          <VoteItem vote={addressVote} />
          <WarningMessage>
            Resubmitting the vote will override the current voting record
          </WarningMessage>
        </VStack>
      ) : (
        <div className="flex justify-center py-[12px] text14Medium text-textTertiary">
          No voting record
        </div>
      )}
    </div>
  );
}
