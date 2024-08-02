import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";

export function useLocalTreasuryButton() {
  const [showCreateLocalTreasuryProposal, setShowCreateLocalTreasuryProposal] =
    useState(false);
  const { treasuryProposalTracks } = useChainSettings();

  const localTreasuryButton = !!treasuryProposalTracks && (
    <ChoiceButton
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

export function useUSDxTreasuryButton() {
  const [showCreateUSDxTreasuryProposal, setShowCreateUSDxTreasuryProposal] =
    useState(false);
  const {
    treasuryProposalTracks,
    newProposalQuickStart: { usdxTreasuryProposal } = {},
  } = useChainSettings();

  const usdxTreasuryButton = treasuryProposalTracks && usdxTreasuryProposal && (
    <ChoiceButton
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

export function useRemarkButton() {
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

  const cancelReferendumButton = (
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
