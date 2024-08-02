import { useState } from "react";
import { NewProposalInnerPopup } from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import SubmitProposalPopupCommon, { ChoiceButton } from "./common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { useChainSettings } from "next-common/context/chain";
import { NewTreasuryReferendumInnerPopup } from "../newProposalQuickStart/createTreasuryProposalPopup";
import { NewUSDxTreasuryReferendumInnerPopup } from "../newProposalQuickStart/createUSDxTreasuryProposalPopup";
import { NewRemarkReferendumInnerPopup } from "../newProposalQuickStart/createSystemRemarkProposalPopup";

function useLocalTreasuryButton() {
  const [showCreateLocalTreasuryProposal, setShowCreateLocalTreasuryProposal] =
    useState(false);

  const localTreasuryButton = (
    <ChoiceButton
      key="treasury-local"
      name="Treasury proposal local"
      description="Creating a treasury spend of native token that is locally available"
      onClick={() => setShowCreateLocalTreasuryProposal(true)}
    />
  );

  return {
    localTreasuryButton,
    showCreateLocalTreasuryProposal,
  };
}

function useUSDxTreasuryButton() {
  const [showCreateUSDxTreasuryProposal, setShowCreateUSDxTreasuryProposal] =
    useState(false);
  const {
    treasuryProposalTracks,
    newProposalQuickStart: { usdxTreasuryProposal } = {},
  } = useChainSettings();

  const usdxTreasuryButton = treasuryProposalTracks && usdxTreasuryProposal && (
    <ChoiceButton
      key="treasury-usdx"
      name="USDx treasury proposal"
      description="Creating a treasury spend with assets on AssetHub"
      onClick={() => setShowCreateUSDxTreasuryProposal(true)}
    />
  );

  return {
    usdxTreasuryButton,
    showCreateUSDxTreasuryProposal,
  };
}

function useRemarkButton() {
  const [showNewRemarkPopup, setShowNewRemarkPopup] = useState(false);

  const remarkButton = (
    <ChoiceButton
      key="remark"
      name="Remark"
      description="Creating a remark proposal"
      onClick={() => setShowNewRemarkPopup(true)}
    />
  );

  return {
    remarkButton,
    showNewRemarkPopup,
  };
}

function SubmitProposalInnerPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const { showCreateLocalTreasuryProposal, localTreasuryButton } =
    useLocalTreasuryButton(false);
  const { showCreateUSDxTreasuryProposal, usdxTreasuryButton } =
    useUSDxTreasuryButton(false);
  const { showNewRemarkPopup, remarkButton } = useRemarkButton();

  if (showCreateLocalTreasuryProposal) {
    return <NewTreasuryReferendumInnerPopup onClose={onClose} />;
  }

  if (showCreateUSDxTreasuryProposal) {
    return <NewUSDxTreasuryReferendumInnerPopup onClose={onClose} />;
  }

  if (showNewRemarkPopup) {
    return <NewRemarkReferendumInnerPopup onClose={onClose} />;
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
        {[localTreasuryButton, usdxTreasuryButton, remarkButton].filter(
          Boolean,
        )}
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
