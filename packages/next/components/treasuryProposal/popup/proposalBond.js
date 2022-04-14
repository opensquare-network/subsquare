import { useEffect, useState } from "react";

import { useApi } from "utils/hooks";
import Tooltip from "next-common/components/tooltip";
import { Label, TooltipWrapper, TextBox } from "./styled";

export default function ProposalBond({ chain }) {
  const [bondPercentage, setBondPercentage] = useState("");

  const api = useApi(chain);

  useEffect(() => {
    if (api) {
      setBondPercentage(api.consts.treasury.proposalBond.toHuman());
    }
  }, [api]);

  return (
    <div>
      <TooltipWrapper>
        <Label>Proposal bond</Label>
        <Tooltip content={"The on-chain percentage for treasury"} />
      </TooltipWrapper>
      <TextBox>{bondPercentage}</TextBox>
    </div>
  );
}
