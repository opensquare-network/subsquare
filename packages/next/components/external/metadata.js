import KVList from "next-common/components/listInfo/kvList";
import Proposal from "next-common/components/proposal";

export default function Metadata({ external }) {
  if (!external) {
    return null;
  }

  const metadata = [
    ["Hash", external.proposalHash],
    ["Threshold", external.voteThreshold],
  ];

  if (external.preImage) {
    metadata.push([
      <Proposal
        key="proposal"
        call={external.preImage.call}
        shorten={external.preImage.shorten}
        motionIndex={external.motionIndex}
        referendumIndex={external.referendumIndex}
      />,
    ]);
  }

  return <KVList title="Metadata" data={metadata} showFold />;
}
