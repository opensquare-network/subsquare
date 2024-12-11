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

function useSpendTreasuryAjunToken() {
  const [showAjunaSpendLocalPopup, setShowAjunaSpendLocalPopup] =
    useState(false);
  const ajunaSpendLocalButton = (
    <ChoiceButton
      key="spend-treasury-ajun"
      name="Spend treasury AJUN token"
      description="Create a treasury spend of native token that is locally available"
      onClick={() => {
        setShowAjunaSpendLocalPopup(true);
      }}
    />
  );
  return { ajunaSpendLocalButton, showAjunaSpendLocalPopup };
}

function useAjunaSpendTreasuryUSDxToken() {
  const [showAjunaSpendUSDxPopup, setShowAjunaSpendUSDxPopup] = useState(false);
  const ajunaSpendUSDxButton = (
    <ChoiceButton
      key="spend-treasury-usdx"
      name="Spend treasury USDx token"
      description="Create a treasury spend of USDT/USDC token that is locally available"
      onClick={() => {
        setShowAjunaSpendUSDxPopup(true);
      }}
    />
  );
  return { ajunaSpendUSDxButton, showAjunaSpendUSDxPopup };
}

export function SubmitDemocracyProposalInnerPopup({ children }) {
  const chain = useChain();
  const { ajunaSpendLocalButton, showAjunaSpendLocalPopup } =
    useSpendTreasuryAjunToken();
  const { ajunaSpendUSDxButton, showAjunaSpendUSDxPopup } =
    useAjunaSpendTreasuryUSDxToken();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  if (showAjunaSpendLocalPopup) {
    return <AjunaSpendLocalProposalPopup />;
  }

  if (showAjunaSpendUSDxPopup) {
    return <AjunaSpendUSDxProposalPopup />;
  }

  let quickStartButtons = null;

  if (isAjunaChain(chain)) {
    quickStartButtons = [ajunaSpendLocalButton, ajunaSpendUSDxButton];
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
