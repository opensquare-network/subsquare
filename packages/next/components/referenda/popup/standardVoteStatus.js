import {
  VotingStatusContent,
  TooltipWrapper,
  Label,
  VotingStatusWrapper,
  StatusWrapper,
  WarningWrapper,
} from "./styled";
import DisplayValue from "next-common/components/displayValue";
import ApproveIcon from "next-common/assets/imgs/icons/approve.svg";
import RejectIcon from "next-common/assets/imgs/icons/reject.svg";
import { toPrecision } from "utils";
import { convictionToLockX } from "utils/referendumUtil";

export default function StandardVoteStatus({
  addressVoteStandardBalance,
  addressVoteStandardConviction,
  addressVoteStandardAye,
  node,
}) {
  return (
    <VotingStatusContent>
      <TooltipWrapper>
        <Label>Current voting</Label>
        <VotingStatusWrapper>
          <div>Standard</div>
        </VotingStatusWrapper>
      </TooltipWrapper>
      <StatusWrapper>
        <div className="value">
          <DisplayValue
            value={toPrecision(addressVoteStandardBalance, node.decimals)}
            symbol={node?.voteSymbol || node?.symbol}
          />
          <span>{`(${convictionToLockX(addressVoteStandardConviction)})`}</span>
        </div>
        {addressVoteStandardAye ? (
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
      <WarningWrapper>
        Resubmitting the vote will override the current voting record
      </WarningWrapper>
    </VotingStatusContent>
  );
}
