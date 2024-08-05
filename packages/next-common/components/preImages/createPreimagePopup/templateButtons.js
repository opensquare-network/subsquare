import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";

export function useSpendLocalTreasuryButton() {
  const [showSpendLocalTreasuryPopup, setShowSpendLocalTreasuryPopup] =
    useState(false);
  const { treasuryProposalTracks } = useChainSettings();

  const localTreasuryButton = !!treasuryProposalTracks && (
    <ChoiceButton
      name="Treasury proposal local"
      description="Creating a treasury spend of native token that is locally available"
      onClick={() => setShowSpendLocalTreasuryPopup(true)}
    />
  );

  return {
    localTreasuryButton,
    showSpendLocalTreasuryPopup,
  };
}

export function useSpendUSDxTreasuryButton() {
  const [showSpendUSDxTreasuryPopup, setShowSpendUSDxTreasuryPopup] =
    useState(false);
  const {
    treasuryProposalTracks,
    newProposalQuickStart: { usdxTreasuryProposal } = {},
  } = useChainSettings();

  const usdxTreasuryButton = treasuryProposalTracks && usdxTreasuryProposal && (
    <ChoiceButton
      name="USDx treasury proposal"
      description="Creating a treasury spend with assets on AssetHub"
      onClick={() => setShowSpendUSDxTreasuryPopup(true)}
    />
  );

  return {
    usdxTreasuryButton,
    showSpendUSDxTreasuryPopup,
  };
}

export function useNewRemarkButton() {
  const [showNewRemarkPopup, setShowNewRemarkPopup] = useState(false);

  const remarkButton = (
    <ChoiceButton
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

export function useCancelReferendumButton() {
  const [showCancelReferendumPopup, setShowCancelReferendumPopup] =
    useState(false);
  const { newProposalQuickStart: { cancelReferendum } = {} } =
    useChainSettings();

  const cancelReferendumButton = cancelReferendum && (
    <ChoiceButton
      name="Cancel a referendum"
      description="Canceling an ongoing referendum and returning the deposit"
      onClick={() => setShowCancelReferendumPopup(true)}
    />
  );

  return {
    cancelReferendumButton,
    showCancelReferendumPopup,
  };
}

export function useKillReferendumButton() {
  const [showKillReferendumPopup, setShowKillReferendumPopup] = useState(false);
  const { newProposalQuickStart: { killReferendum } = {} } = useChainSettings();

  const killReferendumButton = killReferendum && (
    <ChoiceButton
      name="Kill a referendum"
      description="Killing an ongoing referendum and the submission & decision deposits will be slashed"
      onClick={() => setShowKillReferendumPopup(true)}
    />
  );

  return {
    killReferendumButton,
    showKillReferendumPopup,
  };
}
