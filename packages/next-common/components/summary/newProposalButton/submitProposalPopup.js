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
  SpendLocalTreasuryButton,
  SpendUSDxTreasuryButton,
  SpendDotOnAssetHubButton,
  NewRemarkButton,
  CancelReferendumButton,
  KillReferendumButton,
} from "next-common/components/preImages/createPreimagePopup/templateButtons";
import { KillReferendumInnerPopup } from "../newProposalQuickStart/killReferendumInnerPopup";
import { SpendDotOnAssetHubReferendumInnerPopup } from "../newProposalQuickStart/spendDotOnAssetHubPopup";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";
import { useChainSettings } from "next-common/context/chain";

function SpendLocalTreasury() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <SpendLocalTreasuryButton
      onClick={() => setForwardPopup(<NewTreasuryReferendumInnerPopup />)}
    />
  );
}

function SpendUSDxTreasury() {
  const { setForwardPopup } = useForwardPopupContext();
  const {
    treasuryProposalTracks,
    newProposalQuickStart: { usdxTreasuryProposal } = {},
  } = useChainSettings();

  if (!treasuryProposalTracks || !usdxTreasuryProposal) {
    return null;
  }

  return (
    <SpendUSDxTreasuryButton
      onClick={() => setForwardPopup(<NewUSDxTreasuryReferendumInnerPopup />)}
    />
  );
}

function SpendDotOnAssetHub() {
  const { setForwardPopup } = useForwardPopupContext();
  const {
    treasuryProposalTracks,
    newProposalQuickStart: { spendDotOnAssetHubProposal } = {},
  } = useChainSettings();

  if (!treasuryProposalTracks || !spendDotOnAssetHubProposal) {
    return null;
  }

  return (
    <SpendDotOnAssetHubButton
      onClick={() =>
        setForwardPopup(<SpendDotOnAssetHubReferendumInnerPopup />)
      }
    />
  );
}

function NewRemark() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <NewRemarkButton
      onClick={() => setForwardPopup(<NewRemarkReferendumInnerPopup />)}
    />
  );
}

function CancelReferendum() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <CancelReferendumButton
      onClick={() => setForwardPopup(<CancelReferendumInnerPopup />)}
    />
  );
}

function KillReferendum() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <KillReferendumButton
      onClick={() => setForwardPopup(<KillReferendumInnerPopup />)}
    />
  );
}

function ReferendaQuickStart() {
  return (
    <QuickStart>
      <SpendLocalTreasury />
      <SpendUSDxTreasury />
      <SpendDotOnAssetHub />
      <NewRemark />
      <CancelReferendum />
      <KillReferendum />
    </QuickStart>
  );
}

export default function SubmitProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
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
          <ReferendaQuickStart />
        </SubmitProposalPopupCommon>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
