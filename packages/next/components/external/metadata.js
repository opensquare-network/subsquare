import KVList from "next-common/components/listInfo/kvList";

export default function Metadata({ external }) {
  if (!external) {
    return null;
  }

  const metadata = [
    ["Hash", external.proposalHash],
    ["Threshold", external.voteThreshold],
  ];

  return <KVList title="Metadata" data={metadata} showFold />;
}
