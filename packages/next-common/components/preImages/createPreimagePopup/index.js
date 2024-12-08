import { useState } from "react";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import MainPopup from "./mainPopup";
import { NewPreimageInnerPopup } from "../newPreimagePopup";
import NewLocalTreasuryProposalPopup from "./newLocalTreasuryProposalPopup";
import NewUSDxTreasuryProposalPopup from "./newUSDxTreasuryProposalPopup";
import NewRemarkProposalPopup from "./newRemarkProposalPopup";
import CancelReferendumPopup from "./cancelReferendumPopup";
import {
  useCancelReferendumButton,
  useSpendLocalTreasuryButton,
  useNewRemarkButton,
  useSpendUSDxTreasuryButton,
  useKillReferendumButton,
  useFellowshipTreasurySpendButton,
  useSpendDotOnAssetHubButton,
} from "./templateButtons";
import KillReferendumPopup from "./killReferendumPopup";
import { isCollectivesChain } from "next-common/utils/chain";
import NewFellowshipTreasuryProposalPopup from "./newFellowshipTreasuryProposalPopup";
import { useChain } from "next-common/context/chain";
import SpendDotOnAssetHubPopup from "./spendDotOnAssetHubPopup";

export function QuickStart({ children }) {
  return (
    <div className="flex flex-col gap-[12px] !mt-[24px]">
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <div className="flex flex-col flex-wrap gap-[12px]">{children}</div>
    </div>
  );
}

function PopupContent() {
  const chain = useChain();
  const { onClose } = usePopupParams();
  const [showNewPreimage, setShowNewPreimage] = useState();
  const { showSpendLocalTreasuryPopup, localTreasuryButton } =
    useSpendLocalTreasuryButton(false);
  const { showFellowshipTreasurySpendPopup, fellowshipTreasurySpendButton } =
    useFellowshipTreasurySpendButton(false);
  const { showSpendUSDxTreasuryPopup, usdxTreasuryButton } =
    useSpendUSDxTreasuryButton(false);
  const { showSpendDotOnAssetHubPopup, spendDotOnAssetHubButton } =
    useSpendDotOnAssetHubButton();
  const { showNewRemarkPopup, remarkButton } = useNewRemarkButton();
  const { showCancelReferendumPopup, cancelReferendumButton } =
    useCancelReferendumButton();
  const { showKillReferendumPopup, killReferendumButton } =
    useKillReferendumButton();

  if (showNewPreimage) {
    return <NewPreimageInnerPopup onClose={onClose} />;
  }

  if (showFellowshipTreasurySpendPopup) {
    return <NewFellowshipTreasuryProposalPopup onClose={onClose} />;
  }

  if (showSpendLocalTreasuryPopup) {
    return <NewLocalTreasuryProposalPopup onClose={onClose} />;
  }

  if (showSpendUSDxTreasuryPopup) {
    return <NewUSDxTreasuryProposalPopup onClose={onClose} />;
  }

  if (showSpendDotOnAssetHubPopup) {
    return <SpendDotOnAssetHubPopup onClose={onClose} />;
  }

  if (showNewRemarkPopup) {
    return <NewRemarkProposalPopup onClose={onClose} />;
  }

  if (showCancelReferendumPopup) {
    return <CancelReferendumPopup onClose={onClose} />;
  }

  if (showKillReferendumPopup) {
    return <KillReferendumPopup onClose={onClose} />;
  }

  return (
    <MainPopup setShowNewPreimage={setShowNewPreimage} onClose={onClose}>
      <QuickStart>
        {isCollectivesChain(chain)
          ? fellowshipTreasurySpendButton
          : localTreasuryButton}
        {usdxTreasuryButton}
        {spendDotOnAssetHubButton}
        {remarkButton}
        {cancelReferendumButton}
        {killReferendumButton}
      </QuickStart>
    </MainPopup>
  );
}

export default function CreatePreimagePopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <PopupContent />
    </SignerPopupWrapper>
  );
}
