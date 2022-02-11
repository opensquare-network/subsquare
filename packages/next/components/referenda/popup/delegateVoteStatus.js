import {
  VotingStatusContent,
  TooltipWrapper,
  Label,
  VotingStatusWrapper,
  StatusWrapper,
} from "./styled";
import Tooltip from "components/tooltip";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";

export default function SplitVoteStatus({ addressVoteDelegateAye }) {
  return (
    <VotingStatusContent>
      <TooltipWrapper>
        <Label>Current voting</Label>
        <VotingStatusWrapper>
          <div>Delegate</div>
          <Tooltip content="Vote by delegating target" />
        </VotingStatusWrapper>
      </TooltipWrapper>
      <StatusWrapper>
        <div className="value">Voting</div>
        {addressVoteDelegateAye ? (
          <div className="result">
            Aye
            <ApproveIcon />
          </div>
        ) : (
          <div className="result">
            Nay
            <RejectIcon />
          </div>
        )}
      </StatusWrapper>
    </VotingStatusContent>
  );
}
