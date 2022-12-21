import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function VoteLock({ voteLock, setVoteLock }) {
  return (
    <ConvictionField
      conviction={voteLock}
      setConviction={setVoteLock}
      title="Vote lock"
    />
  );
}
