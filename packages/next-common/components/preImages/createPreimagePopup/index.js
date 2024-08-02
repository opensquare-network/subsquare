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
  useLocalTreasuryButton,
  useRemarkButton,
  useUSDxTreasuryButton,
} from "./templateButtons";

export function QuickStart({ children }) {
  return (
    <div className="flex flex-col gap-[16px] !mt-[24px]">
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <div className="flex flex-col flex-wrap gap-[16px]">{children}</div>
    </div>
  );
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const [showNewPreimage, setShowNewPreimage] = useState();
  const { showCreateLocalTreasuryProposal, localTreasuryButton } =
    useLocalTreasuryButton(false);
  const { showCreateUSDxTreasuryProposal, usdxTreasuryButton } =
    useUSDxTreasuryButton(false);
  const { showNewRemarkPopup, remarkButton } = useRemarkButton();
  const { showCancelReferendumPopup, cancelReferendumButton } =
    useCancelReferendumButton();

  if (showNewPreimage) {
    return <NewPreimageInnerPopup onClose={onClose} />;
  }

  if (showCreateLocalTreasuryProposal) {
    return <NewLocalTreasuryProposalPopup onClose={onClose} />;
  }

  if (showCreateUSDxTreasuryProposal) {
    return <NewUSDxTreasuryProposalPopup onClose={onClose} />;
  }

  if (showNewRemarkPopup) {
    return <NewRemarkProposalPopup onClose={onClose} />;
  }

  if (showCancelReferendumPopup) {
    return <CancelReferendumPopup onClose={onClose} />;
  }

  return (
    <MainPopup setShowNewPreimage={setShowNewPreimage} onClose={onClose}>
      <QuickStart>
        {localTreasuryButton}
        {usdxTreasuryButton}
        {remarkButton}
        {cancelReferendumButton}
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
