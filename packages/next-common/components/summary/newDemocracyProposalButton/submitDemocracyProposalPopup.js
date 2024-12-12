import { useMemo, useState } from "react";
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
  const popup = useMemo(() => <AjunaSpendLocalProposalPopup />, []);
  return (
    <ChoiceButton
      key="spend-treasury-ajun"
      name="Spend treasury AJUN token"
      description="Create a treasury spend of native token that is locally available"
      onClick={() => {
        setForwardPopup(popup);
      }}
    />
  );
}

function AjunaSpendTreasuryUSDxToken() {
  const { setForwardPopup } = useForwardPopupContext();
  const popup = useMemo(() => <AjunaSpendUSDxProposalPopup />, []);
  return (
    <ChoiceButton
      key="spend-treasury-usdx"
      name="Spend treasury USDx token"
      description="Create a treasury spend of USDT/USDC token that is locally available"
      onClick={() => {
        setForwardPopup(popup);
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

export function SubmitDemocracyProposalInnerPopup({ children }) {
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
      {children}
    </SubmitProposalPopupCommon>
  );
}

export default function SubmitDemocracyProposalPopup({ onClose, children }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <SubmitDemocracyProposalInnerPopup>
          {children}
        </SubmitDemocracyProposalInnerPopup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
