import ConvictionField from "next-common/components/popup/fields/convictionField";
import { useChainSettings } from "next-common/context/chain";

export default function DemocracyConviction({
  balance,
  voteLock,
  setVoteLock,
  module,
}) {
  const chainSettings = useChainSettings();

  return (
    <ConvictionField
      title="Voting Power Multiplier"
      titleTooltip={`Slide to increase your voting power multiplier. The higher the multiplier, the longer your ${chainSettings.symbol} will be locked`}
      balance={balance}
      conviction={voteLock}
      setConviction={setVoteLock}
      module={module}
    />
  );
}
