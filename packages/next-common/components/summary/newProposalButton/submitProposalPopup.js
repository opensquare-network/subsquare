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
  useSpendLocalTreasuryButton,
  useNewRemarkButton,
  useSpendUSDxTreasuryButton,
  useKillReferendumButton,
  useSpendDotOnAssetHubButton,
} from "next-common/components/preImages/createPreimagePopup/templateButtons";
import { KillReferendumInnerPopup } from "../newProposalQuickStart/killReferendumInnerPopup";
import { SpendDotOnAssetHubReferendumInnerPopup } from "../newProposalQuickStart/spendDotOnAssetHubPopup";

function SubmitProposalInnerPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const { showSpendLocalTreasuryPopup, localTreasuryButton } =
    useSpendLocalTreasuryButton(false);
  const { showSpendUSDxTreasuryPopup, usdxTreasuryButton } =
    useSpendUSDxTreasuryButton(false);
  const { showSpendDotOnAssetHubPopup, spendDotOnAssetHubButton } =
    useSpendDotOnAssetHubButton();

  const { showNewRemarkPopup, remarkButton } = useNewRemarkButton();
  const { showCancelReferendumPopup, cancelReferendumButton } =
    useCancelReferendumButton();
  const { showKillReferendumPopup, killReferendumButton } =
    useKillReferendumButton();

  if (showSpendLocalTreasuryPopup) {
    return <NewTreasuryReferendumInnerPopup onClose={onClose} />;
  }

  if (showSpendUSDxTreasuryPopup) {
    return <NewUSDxTreasuryReferendumInnerPopup onClose={onClose} />;
  }

  if (showSpendDotOnAssetHubPopup) {
    return <SpendDotOnAssetHubReferendumInnerPopup onClose={onClose} />;
  }

  if (showNewRemarkPopup) {
    return <NewRemarkReferendumInnerPopup onClose={onClose} />;
  }

  if (showCancelReferendumPopup) {
    return <CancelReferendumInnerPopup onClose={onClose} />;
  }

  if (showKillReferendumPopup) {
    return <KillReferendumInnerPopup onClose={onClose} />;
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
        {spendDotOnAssetHubButton}
        {remarkButton}
        {cancelReferendumButton}
        {killReferendumButton}
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
