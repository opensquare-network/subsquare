import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function DemocracyVoteLock({
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
      title="Vote lock"
      module={module}
    />
  );
}
