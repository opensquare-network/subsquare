import {
  VotingStatusContent,
  TooltipWrapper,
  VotingStatusWrapper,
  Label,
} from "next-common/components/popup/styled";
import Loading from "next-common/components/loading";
import LoadingStatus from "next-common/components/popup/loadingVotingStatus";

export default function LoadingVoteStatus({ title = "Current voting" }) {
  return (
    <VotingStatusContent>
      <TooltipWrapper>
        <Label>{title}</Label>
        <VotingStatusWrapper>
          <Loading size={10} />
        </VotingStatusWrapper>
      </TooltipWrapper>
      <LoadingStatus />
    </VotingStatusContent>
  );
}
