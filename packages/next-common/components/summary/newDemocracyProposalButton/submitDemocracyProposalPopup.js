import { useState } from "react";
import { NewDemocracyProposalInnerPopup } from "../newDemocracyProposalPopup";
import SubmitProposalPopupCommon, {
  ChoiceButton,
} from "../newProposalButton/common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { isAjunaChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import AjunaSpendLocalProposalPopup from "./ajuna/spendLocalProposalPopup";
import AjunaSpendUSDxProposalPopup from "./ajuna/spendUSDxProposalPopup";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";

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

function AjunaQuickStart() {
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

export function SubmitDemocracyProposalInnerPopup() {
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      newProposalPopup={
        <NewDemocracyProposalInnerPopup
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    >
      <AjunaQuickStart />
    </SubmitProposalPopupCommon>
  );
}

export default function SubmitDemocracyProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <SubmitDemocracyProposalInnerPopup />
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
