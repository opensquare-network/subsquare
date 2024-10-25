import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";

export function useSpendLocalTreasuryButton() {
  const [showSpendLocalTreasuryPopup, setShowSpendLocalTreasuryPopup] =
    useState(false);

  const localTreasuryButton = (
    <ChoiceButton
      name="Treasury proposal local"
      description="Create a treasury spend of native token that is locally available"
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
      description="Create a treasury spend with assets on AssetHub"
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
      description="Create a remark proposal"
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
      description="Cancel an ongoing referendum and returning the deposit"
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
      description="Kill an ongoing referendum and the submission & decision deposits will be slashed"
      onClick={() => setShowKillReferendumPopup(true)}
    />
  );

  return {
    killReferendumButton,
    showKillReferendumPopup,
  };
}
