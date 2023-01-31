import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function DemocracyVoteLock({ voteLock, setVoteLock, module }) {
  return (
    <ConvictionField
      conviction={voteLock}
      setConviction={setVoteLock}
      title="Vote lock"
      module={module}
    />
  );
}
