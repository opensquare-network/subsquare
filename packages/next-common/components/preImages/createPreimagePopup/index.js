import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import MainPopup from "./mainPopup";
import SpendLocalTreasuryProposalPopup from "./templates/spendLocalTreasuryProposalPopup";
import LocatableAccountTreasuryProposalPopup from "./templates/locatableAccountTreasuryProposalPopup";
import UnitAssetTreasuryProposalPopup from "./templates/unitAssetTreasuryProposalPopup";
import NewUSDxTreasuryProposalPopup from "./templates/newUSDxTreasuryProposalPopup";
import NewRemarkProposalPopup from "./templates/newRemarkProposalPopup";
import CancelReferendumPopup from "./templates/cancelReferendumPopup";
import NewFellowshipTreasuryProposalPopup from "./templates/newFellowshipTreasuryProposalPopup";
import NewFellowshipUSDxTreasuryProposalPopup from "./templates/newFellowshipUSDxTreasuryProposalPopup";
import KillReferendumPopup from "./templates/killReferendumPopup";
import FundMultiAssetBountyPopup from "./templates/fundMultiAssetBountyPopup";
import {
  FellowshipTreasurySpendButton,
  FellowshipUSDxTreasurySpendButton,
  SpendUSDxTreasuryButton,
  TreasuryProposalButton,
  NewRemarkButton,
  CancelReferendumButton,
  KillReferendumButton,
  BatchSpendTreasuryButton,
  HydrationTreasurySpendButton,
  FundMultiAssetBountyButton,
} from "./templateButtons";
import {
  isCollectivesChain,
  isHydrationChain,
  isShibuyaChain,
} from "next-common/utils/chain";
import { useChain, useChainSettings } from "next-common/context/chain";
import {
  TREASURY_SPEND_FORMS,
  getTreasurySpendForm,
} from "next-common/utils/treasury/spendForm";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";
import BatchTreasurySpendPopup from "./templates/batchTreasurySpendPopup";
import HydrationTreasurySpendPopup from "./templates/hydrationTreasurySpendPopup";

export function QuickStart({ children }) {
  return (
    <div className="flex flex-col gap-[12px] !mt-[24px]">
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <div className="flex flex-col flex-wrap gap-[12px]">{children}</div>
    </div>
  );
}

function TreasuryProposal() {
  const { setForwardPopup } = useForwardPopupContext();
  const settings = useChainSettings();
  const chain = useChain();
  const { symbol } = settings;

  switch (getTreasurySpendForm(chain, settings)) {
    case TREASURY_SPEND_FORMS.locatableAccount:
      return (
        <TreasuryProposalButton
          name={`${symbol} treasury proposal`}
          description={`Create a treasury spend of ${symbol}`}
          onClick={() =>
            setForwardPopup(<LocatableAccountTreasuryProposalPopup />)
          }
        />
      );
    case TREASURY_SPEND_FORMS.unitAsset:
      return (
        <TreasuryProposalButton
          name={`${symbol} treasury proposal`}
          description={`Create a treasury spend of ${symbol}`}
          onClick={() => setForwardPopup(<UnitAssetTreasuryProposalPopup />)}
        />
      );
    case TREASURY_SPEND_FORMS.unsupported:
      return null;
    default:
      return (
        <TreasuryProposalButton
          name="Treasury proposal local"
          description="Create a treasury spend of native token that is locally available"
          onClick={() => setForwardPopup(<SpendLocalTreasuryProposalPopup />)}
        />
      );
  }
}

function FellowshipTreasurySpend() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <FellowshipTreasurySpendButton
      onClick={() => setForwardPopup(<NewFellowshipTreasuryProposalPopup />)}
    />
  );
}

function FellowshipUSDxTreasurySpend() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <FellowshipUSDxTreasurySpendButton
      onClick={() =>
        setForwardPopup(<NewFellowshipUSDxTreasuryProposalPopup />)
      }
    />
  );
}

function BatchTreasurySpend() {
  const { setForwardPopup } = useForwardPopupContext();
  const {
    treasuryProposalTracks,
    newProposalQuickStart: { usdxTreasuryProposal } = {},
  } = useChainSettings();

  if (!treasuryProposalTracks || !usdxTreasuryProposal) {
    return null;
  }

  return (
    <BatchSpendTreasuryButton
      onClick={() => setForwardPopup(<BatchTreasurySpendPopup />)}
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

function HydrationTreasurySpend() {
  const { setForwardPopup } = useForwardPopupContext();

  return (
    <HydrationTreasurySpendButton
      onClick={() => setForwardPopup(<HydrationTreasurySpendPopup />)}
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

function FundMultiAssetBounty() {
  const { setForwardPopup } = useForwardPopupContext();
  const { newProposalQuickStart: { fundMultiAssetBounty } = {} } =
    useChainSettings();

  if (!fundMultiAssetBounty) {
    return null;
  }

  return (
    <FundMultiAssetBountyButton
      onClick={() => setForwardPopup(<FundMultiAssetBountyPopup />)}
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
      {isCollectivesChain(chain) && <FellowshipUSDxTreasurySpend />}
      {isHydrationChain(chain) && <HydrationTreasurySpend />}
      <SpendUSDxTreasury />
      <BatchTreasurySpend />
      <FundMultiAssetBounty />
      {!isCollectivesChain(chain) && !isShibuyaChain(chain) && (
        <TreasuryProposal />
      )}
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
