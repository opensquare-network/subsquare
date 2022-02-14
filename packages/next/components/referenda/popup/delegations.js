import { TooltipWrapper, Label, DelegatingValue } from "./styled";
import { toPrecision } from "utils";
import Tooltip from "next-common/components/tooltip";

export default function Delegations({ addressVoteDelegations, node }) {
  return (
    <div>
      <TooltipWrapper>
        <Label>Total Proxy Value</Label>
        <Tooltip content="Voting value for all proxy addresses" />
      </TooltipWrapper>
      <DelegatingValue>
        <div className="vote">
          <div className="balance">
            {toPrecision(addressVoteDelegations, node.decimals)}{" "}
            {node.voteSymbol || node.symbol}
          </div>
        </div>
      </DelegatingValue>
    </div>
  );
}
