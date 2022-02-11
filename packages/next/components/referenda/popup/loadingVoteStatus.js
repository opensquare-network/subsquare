import {
  VotingStatusContent,
  StatusWrapper,
  TooltipWrapper,
  VotingStatusWrapper,
  Label,
} from "./styled";
import Loading from "../loading";

export default function LoadingVoteStatus() {
  return (
    <VotingStatusContent>
      <TooltipWrapper>
        <Label>Current voting</Label>
        <VotingStatusWrapper>
          <Loading size={10} />
        </VotingStatusWrapper>
      </TooltipWrapper>
      <StatusWrapper>
        <Loading size={14} />
      </StatusWrapper>
    </VotingStatusContent>
  );
}
