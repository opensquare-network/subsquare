import { ChoiceButton } from "../../newProposalButton/common";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { isAjunaChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import AjunaSpendLocalProposalPopup from "./spendLocalProposalPopup";
import AjunaSpendUSDxProposalPopup from "./spendUSDxProposalPopup";
import { useForwardPopupContext } from "next-common/context/forwardPopup";

function SpendTreasuryAjunToken() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Spend treasury AJUN token"
      description="Create a treasury spend of native token that is locally available"
      onClick={() => {
        setForwardPopup(<AjunaSpendLocalProposalPopup />);
      }}
    />
  );
}

function AjunaSpendTreasuryUSDxToken() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Spend treasury USDx token"
      description="Create a treasury spend of USDT/USDC token that is locally available"
      onClick={() => {
        setForwardPopup(<AjunaSpendUSDxProposalPopup />);
      }}
    />
  );
}

export function AjunaDemocracyProposalQuickStart() {
  const chain = useChain();
  if (!isAjunaChain(chain)) {
    return null;
  }
  return (
    <QuickStart>
      <SpendTreasuryAjunToken />
      <AjunaSpendTreasuryUSDxToken />
    </QuickStart>
  );
}
