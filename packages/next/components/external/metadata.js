import KVList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";

export default function Metadata({ external, chain }) {
  if (!external) {
    return null;
  }

  const metadata = [
    ["hash", external.proposalHash],
    ["voteThreshould", external.voteThreshold],
  ];

  if (external.preImage) {
    metadata.push([
      <Proposal motion={{ proposal: external.preImage.call }} chain={chain} />,
    ]);
  }

  return <KVList title="Metadata" data={metadata} showFold />;
}
