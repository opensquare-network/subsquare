import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function DemocracyConviction({
  balance,
  voteLock,
  setVoteLock,
  module,
}) {
  return (
    <ConvictionField
      balance={balance}
      conviction={voteLock}
      setConviction={setVoteLock}
      module={module}
    />
  );
}
