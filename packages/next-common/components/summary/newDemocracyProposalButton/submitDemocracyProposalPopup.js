import { useState } from "react";
import { NewDemocracyProposalInnerPopup } from "../newDemocracyProposalPopup";
import SubmitProposalPopupCommon, {
  ChoiceButton,
} from "../newProposalButton/common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { isAjunaChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import SpendLocalProposalPopup from "./spendLocalProposalPopup";
import SpendUSDxProposalPopup from "./spendUSDxProposalPopup";

function useSpendTreasuryAjunToken() {
  const [showSpendLocalPopup, setShowSpendLocalPopup] = useState(false);
  const spendLocalButton = (
    <ChoiceButton
      key="spend-treasury-ajun"
      name="Spend treasury AJUN token"
      description="Create a treasury spend of native token that is locally available"
      onClick={() => {
        setShowSpendLocalPopup(true);
      }}
    />
  );
  return { spendLocalButton, showSpendLocalPopup };
}

function useSpendTreasuryUSDxToken() {
  const [showSpendUSDxPopup, setShowSpendUSDxPopup] = useState(false);
  const spendUSDxButton = (
    <ChoiceButton
      key="spend-treasury-usdx"
      name="Spend treasury USDx token"
      description="Create a treasury spend of USDT/USDC token that is locally available"
      onClick={() => {
        setShowSpendUSDxPopup(true);
      }}
    />
  );
  return { spendUSDxButton, showSpendUSDxPopup };
}

export function SubmitDemocracyProposalInnerPopup({ children }) {
  const chain = useChain();
  const { spendLocalButton, showSpendLocalPopup } = useSpendTreasuryAjunToken();
  const { spendUSDxButton, showSpendUSDxPopup } = useSpendTreasuryUSDxToken();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  if (showSpendLocalPopup) {
    return <SpendLocalProposalPopup />;
  }

  if (showSpendUSDxPopup) {
    return <SpendUSDxProposalPopup />;
  }

  let quickStartButtons = null;

  if (isAjunaChain(chain)) {
    quickStartButtons = [spendLocalButton, spendUSDxButton];
  }

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
      {quickStartButtons && <QuickStart>{quickStartButtons}</QuickStart>}
      {children}
    </SubmitProposalPopupCommon>
  );
}

export default function SubmitDemocracyProposalPopup({ onClose, children }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <SubmitDemocracyProposalInnerPopup>
        {children}
      </SubmitDemocracyProposalInnerPopup>
    </SignerPopupWrapper>
  );
}
