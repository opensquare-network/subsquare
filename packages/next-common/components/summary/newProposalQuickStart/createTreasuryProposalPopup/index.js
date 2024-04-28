import AddressComboField from "next-common/components/popup/fields/addressComboField";
import BalanceField from "next-common/components/popup/fields/balanceField";
import DetailedTrack from "next-common/components/popup/fields/detailedTrackField";
import { PopupButtonWrapper } from "next-common/components/popup/wrapper";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import SubmissionDeposit from "../../newProposalPopup/submissionDeposit";

function PopupContent() {
  const [inputBalance, setInputBalance] = useState("");
  const [, setAddress] = useState("");
  const [trackId, setTrackId] = useState(0);
  const realAddress = useRealAddress();
  const extensionAccounts = useExtensionAccounts();

  return (
    <>
      <SignerWithBalance />
      <BalanceField
        title="Request"
        inputBalance={inputBalance}
        setInputBalance={setInputBalance}
      />
      <AddressComboField
        title="Beneficiary"
        extensionAccounts={extensionAccounts}
        defaultAddress={realAddress}
        setAddress={setAddress}
      />
      <DetailedTrack trackId={trackId} setTrackId={setTrackId} />
      <SubmissionDeposit />
      <PopupButtonWrapper>
        <PrimaryButton>Confirm</PrimaryButton>
      </PopupButtonWrapper>
    </>
  );
}

export default function CreateTreasuryProposalPopup({ onClose }) {
  return (
    <PopupWithSigner title="Create Treasury Proposal" onClose={onClose} wide>
      <PopupContent onClose={onClose} />
    </PopupWithSigner>
  );
}
