import { useState } from "react";
import { NewProposalInnerPopup } from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import SubmitProposalPopupCommon from "./common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { NewTreasuryReferendumInnerPopup } from "../newProposalQuickStart/createTreasuryProposalPopup";
import { NewUSDxTreasuryReferendumInnerPopup } from "../newProposalQuickStart/createUSDxTreasuryProposalPopup";
import { NewRemarkReferendumInnerPopup } from "../newProposalQuickStart/createSystemRemarkProposalPopup";
import { CancelReferendumInnerPopup } from "../newProposalQuickStart/cancelReferendumInnerPopup";
import {
  useCancelReferendumButton,
  useLocalTreasuryButton,
  useRemarkButton,
  useUSDxTreasuryButton,
} from "next-common/components/preImages/createPreimagePopup/templateButtons";

function SubmitProposalInnerPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const { showCreateLocalTreasuryProposal, localTreasuryButton } =
    useLocalTreasuryButton(false);
  const { showCreateUSDxTreasuryProposal, usdxTreasuryButton } =
    useUSDxTreasuryButton(false);
  const { showNewRemarkPopup, remarkButton } = useRemarkButton();
  const { showCancelReferendumPopup, cancelReferendumButton } =
    useCancelReferendumButton();

  if (showCreateLocalTreasuryProposal) {
    return <NewTreasuryReferendumInnerPopup onClose={onClose} />;
  }

  if (showCreateUSDxTreasuryProposal) {
    return <NewUSDxTreasuryReferendumInnerPopup onClose={onClose} />;
  }

  if (showNewRemarkPopup) {
    return <NewRemarkReferendumInnerPopup onClose={onClose} />;
  }

  if (showCancelReferendumPopup) {
    return <CancelReferendumInnerPopup onClose={onClose} />;
  }

  return (
    <SubmitProposalPopupCommon
      setPreimageHash={setPreimageHash}
      setPreimageLength={setPreimageLength}
      newProposalPopup={
        <NewProposalInnerPopup
          track={period}
          preimageHash={preimageHash}
          preimageLength={preimageLength}
        />
      }
    >
      <QuickStart>
        {localTreasuryButton}
        {usdxTreasuryButton}
        {remarkButton}
        {cancelReferendumButton}
      </QuickStart>
    </SubmitProposalPopupCommon>
  );
}

export default function SubmitProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <SubmitProposalInnerPopup />
    </SignerPopupWrapper>
  );
}
