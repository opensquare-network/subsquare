import Copyable from "next-common/components/copyable";
import KVList from "next-common/components/listInfo/kvList";

export default function Metadata({ external }) {
  if (!external) {
    return null;
  }

  const metadata = [
    ["Hash", <Copyable key="hash">{external.proposalHash}</Copyable>],
    ["Threshold", external.voteThreshold],
  ];

  return <KVList title="Metadata" data={metadata} showFold />;
}
