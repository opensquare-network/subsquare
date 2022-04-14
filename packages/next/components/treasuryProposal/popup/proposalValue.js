import BalanceInput from "components/balanceInput";
import { getNode } from "utils";
import Tooltip from "next-common/components/tooltip";
import { Label, TooltipWrapper } from "./styled";

export default function ProposalValue({
  chain,
  setValue,
}) {
  const node = getNode(chain);

  return (
    <div>
      <TooltipWrapper>
        <Label>Value</Label>
        <Tooltip
          content={"The amount that will be allocated from the treasury pot"}
        />
      </TooltipWrapper>
      <BalanceInput setValue={setValue} symbol={node?.symbol} />
    </div>
  );
}
