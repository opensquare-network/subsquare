import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function DemocracyConviction({
  balance,
  voteLock,
  setVoteLock,
  module,
}) {
  return (
    <ConvictionField
      title="Voting Power Multiplier"
      titleTooltip="Slide to increase your voting power multiplier. The higher the multiplier, the longer your DOT will be locked"
      balance={balance}
      conviction={voteLock}
      setConviction={setVoteLock}
      module={module}
    />
  );
}
