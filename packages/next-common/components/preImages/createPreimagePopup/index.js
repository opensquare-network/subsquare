import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import MainPopup from "./mainPopup";
import NewLocalTreasuryProposalPopup from "./templates/newLocalTreasuryProposalPopup";
import NewUSDxTreasuryProposalPopup from "./templates/newUSDxTreasuryProposalPopup";
import NewRemarkProposalPopup from "./templates/newRemarkProposalPopup";
import CancelReferendumPopup from "./templates/cancelReferendumPopup";
import NewFellowshipTreasuryProposalPopup from "./templates/newFellowshipTreasuryProposalPopup";
import SpendDotOnAssetHubPopup from "./templates/spendDotOnAssetHubPopup";
import KillReferendumPopup from "./templates/killReferendumPopup";
import {
  SpendLocalTreasuryButton,
  FellowshipTreasurySpendButton,
  SpendUSDxTreasuryButton,
  SpendDotOnAssetHubButton,
  NewRemarkButton,
  CancelReferendumButton,
  KillReferendumButton,
} from "./templateButtons";
import { isCollectivesChain, isShibuyaChain } from "next-common/utils/chain";
import { useChain, useChainSettings } from "next-common/context/chain";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";

export function QuickStart({ children }) {
  return (
    <div className="flex flex-col gap-[12px] !mt-[24px]">
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <div className="flex flex-col flex-wrap gap-[12px]">{children}</div>
    </div>
  );
}

function SpendLocalTreasury() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <SpendLocalTreasuryButton
      onClick={() => setForwardPopup(<NewLocalTreasuryProposalPopup />)}
    />
  );
}

function FellowshipTreasurySpend() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <FellowshipTreasurySpendButton
      onClick={() => setForwardPopup(<NewFellowshipTreasuryProposalPopup />)}
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
      onClick={() => setForwardPopup(<NewUSDxTreasuryProposalPopup />)}
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
      onClick={() => setForwardPopup(<SpendDotOnAssetHubPopup />)}
    />
  );
}

function NewRemark() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <NewRemarkButton
      onClick={() => setForwardPopup(<NewRemarkProposalPopup />)}
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
      onClick={() => setForwardPopup(<CancelReferendumPopup />)}
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
      onClick={() => setForwardPopup(<KillReferendumPopup />)}
    />
  );
}

function ProposalTemplateQuickStart() {
  const chain = useChain();
  return (
    <QuickStart>
      {isCollectivesChain(chain) && <FellowshipTreasurySpend />}
      {!isCollectivesChain(chain) && !isShibuyaChain(chain) && (
        <SpendLocalTreasury />
      )}
      <SpendUSDxTreasury />
      <SpendDotOnAssetHub />
      <NewRemark />
      <CancelReferendum />
      <KillReferendum />
    </QuickStart>
  );
}

export default function CreatePreimagePopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <MainPopup onClose={onClose}>
          <ProposalTemplateQuickStart />
        </MainPopup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
