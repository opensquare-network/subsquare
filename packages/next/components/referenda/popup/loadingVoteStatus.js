import {
  VotingStatusContent,
  TooltipWrapper,
  VotingStatusWrapper,
  Label,
} from "next-common/components/popup/styled";
import Loading from "next-common/components/loading";
import LoadingStatus from "next-common/components/popup/loadingVotingStatus";

export default function LoadingVoteStatus() {
  return (
    <VotingStatusContent>
      <TooltipWrapper>
        <Label>Current voting</Label>
        <VotingStatusWrapper>
          <Loading size={10} />
        </VotingStatusWrapper>
      </TooltipWrapper>
      <LoadingStatus />
    </VotingStatusContent>
  );
}
