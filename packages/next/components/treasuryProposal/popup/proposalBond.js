import PopupLabel from "next-common/components/popup/label";
import { useEffect, useState } from "react";

import { useApi } from "utils/hooks";
import { TextBox } from "./styled";

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
      <PopupLabel
        text={"Proposal bond"}
        tooltip={"The on-chain percentage for treasury"}
      />
      <TextBox>{bondPercentage}</TextBox>
    </div>
  );
}
