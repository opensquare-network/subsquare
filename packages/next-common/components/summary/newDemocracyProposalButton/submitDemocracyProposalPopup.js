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

function useSpendTreasuryAjunToken() {
  const [showSpendLocalPopup, setShowSpendLocalPopup] = useState(false);
  const spendLocalButton = (
    <ChoiceButton
      key="approve-treasury-proposal"
      name="Spend treasury AJUN token"
      description="Create a treasury spend of native token that is locally available"
      onClick={() => {
        setShowSpendLocalPopup(true);
      }}
    />
  );
  return { spendLocalButton, showSpendLocalPopup };
}

export function SubmitDemocracyProposalInnerPopup({ children }) {
  const chain = useChain();
  const { spendLocalButton, showSpendLocalPopup } = useSpendTreasuryAjunToken();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  if (showSpendLocalPopup) {
    return <SpendLocalProposalPopup />;
  }

  let quickStartButtons = null;

  if (isAjunaChain(chain)) {
    quickStartButtons = [spendLocalButton];
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
