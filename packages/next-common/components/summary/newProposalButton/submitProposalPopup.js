import { useCallback } from "react";
import { NewProposalInnerPopup } from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import { NewPreimageButton, NewProposalFromPreimageButton } from "./common";
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
import Popup from "next-common/components/popup/wrapper/Popup";
import { NewPreimageInnerPopup } from "next-common/components/preImages/newPreimagePopup";

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
  const { newProposalQuickStart: { cancelReferendum } = {} } =
    useChainSettings();

  if (!cancelReferendum) {
    return null;
  }

  return (
    <CancelReferendumButton
      onClick={() => setForwardPopup(<CancelReferendumInnerPopup />)}
    />
  );
}

function KillReferendum() {
  const { setForwardPopup } = useForwardPopupContext();
  const { newProposalQuickStart: { killReferendum } = {} } = useChainSettings();

  if (!killReferendum) {
    return null;
  }

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

function NewPreimage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();

  const onPreimageCreated = useCallback(
    ({ hash, length }) => {
      setForwardPopup(
        <NewProposalInnerPopup
          track={period}
          preimageHash={hash}
          preimageLength={length}
        />,
      );
    },
    [period, setForwardPopup],
  );

  return (
    <NewPreimageButton
      onClick={() =>
        setForwardPopup(<NewPreimageInnerPopup onCreated={onPreimageCreated} />)
      }
    />
  );
}

function NewProposalFromPreImage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <NewProposalFromPreimageButton
      onClick={() => setForwardPopup(<NewProposalInnerPopup track={period} />)}
    />
  );
}

export default function SubmitProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <Popup title="Submit Proposal" onClose={onClose}>
          <div className="flex flex-col !mt-[24px] gap-[12px]">
            <NewPreimage />
            <NewProposalFromPreImage />
          </div>
          <ReferendaQuickStart />
        </Popup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
