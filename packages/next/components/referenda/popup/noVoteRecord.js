import {
  VotingStatusContent,
  StatusWrapper,
  TooltipWrapper,
  Label,
} from "./styled";

export default function NoVoteRecord() {
  return (
    <VotingStatusContent>
      <TooltipWrapper>
        <Label>Current voting</Label>
      </TooltipWrapper>
      <StatusWrapper>
        <div className="no-data">No voting record</div>
      </StatusWrapper>
    </VotingStatusContent>
  );
}
