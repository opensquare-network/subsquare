import {
  VotingStatusContent,
  TooltipWrapper,
  Label,
  VotingStatusWrapper,
  StatusWrapper,
  WarningWrapper,
} from "./styled";
import Tooltip from "next-common/components/tooltip";
import DisplayValue from "next-common/components/displayValue";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";
import { toPrecision } from "utils";

export default function SplitVoteStatus({
  addressVoteSplitAye,
  addressVoteSplitNay,
  node,
}) {
  return (
    <VotingStatusContent>
      <TooltipWrapper>
        <Label>Current voting</Label>
        <VotingStatusWrapper>
          <div>Split</div>
          <Tooltip content="Vote for both aye and nay" />
        </VotingStatusWrapper>
      </TooltipWrapper>
      <StatusWrapper>
        <div className="value">
          <DisplayValue
            value={toPrecision(addressVoteSplitAye, node.decimals)}
            symbol={node?.voteSymbol || node?.symbol}
          />
        </div>
        <div className="result">
          Aye
          <ApproveIcon />
        </div>
      </StatusWrapper>
      <StatusWrapper>
        <div className="value">
          <DisplayValue
            value={toPrecision(addressVoteSplitNay, node.decimals)}
            symbol={node?.voteSymbol || node?.symbol}
          />
        </div>
        <div className="result">
          Nay
          <RejectIcon />
        </div>
      </StatusWrapper>
      <WarningWrapper>
        Resubmitting the vote will override the current voting record
      </WarningWrapper>
    </VotingStatusContent>
  );
}
