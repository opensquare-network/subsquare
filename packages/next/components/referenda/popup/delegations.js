import { TooltipWrapper, Label, DelegatingValue } from "./styled";
import { toPrecision } from "utils";
import Tooltip from "next-common/components/tooltip";

export default function Delegations({ delegationsVotes, node }) {
  return (
    <div>
      <TooltipWrapper>
        <Label>Total Proxy Value</Label>
        <Tooltip content="Voting value for all proxy addresses" />
      </TooltipWrapper>
      <DelegatingValue>
        <div className="vote">
          <div className="balance">
            {toPrecision(delegationsVotes, node.decimals)}{" "}
            {node.voteSymbol || node.symbol}
          </div>
        </div>
      </DelegatingValue>
    </div>
  );
}
