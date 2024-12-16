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
import { useForwardPopupContext } from "next-common/context/forwardPopup";
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

export default function ReferendaProposalQuickStart() {
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
