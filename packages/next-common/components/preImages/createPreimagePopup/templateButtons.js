import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import { InfoPopoular } from "@osn/icons/subsquare";

export function FellowshipTreasurySpendButton({ onClick }) {
  return (
    <ChoiceButton
      name="Fellowship treasury spend"
      description="Create a treasury spend of DOT from AssetHub fellowship treasury account"
      onClick={onClick}
    />
  );
}

export function SpendLocalTreasuryButton({ onClick }) {
  return (
    <ChoiceButton
      name="Treasury proposal local"
      description="Create a treasury spend of native token that is locally available"
      onClick={onClick}
    />
  );
}

export function SpendUSDxTreasuryButton({ onClick }) {
  return (
    <ChoiceButton
      name="USDx treasury proposal"
      description="Create a treasury spend with assets on AssetHub"
      onClick={onClick}
      buttonSuffix={<InfoPopoular className="w-4 h-4 ml-2" />}
    />
  );
}

export function SpendDotOnAssetHubButton({ onClick }) {
  return (
    <ChoiceButton
      name="Spend DOT on AssetHub"
      description="Create a treasury spend with DOT asset on AssetHub"
      onClick={onClick}
    />
  );
}

export function NewRemarkButton({ onClick }) {
  return (
    <ChoiceButton
      name="Remark"
      description="Create a remark proposal"
      onClick={onClick}
    />
  );
}

export function CancelReferendumButton({ onClick }) {
  return (
    <ChoiceButton
      name="Cancel a referendum"
      description="Cancel an ongoing referendum and returning the deposit"
      onClick={onClick}
    />
  );
}

export function KillReferendumButton({ onClick }) {
  return (
    <ChoiceButton
      name="Kill a referendum"
      description="Kill an ongoing referendum and the submission & decision deposits will be slashed"
      onClick={onClick}
    />
  );
}
