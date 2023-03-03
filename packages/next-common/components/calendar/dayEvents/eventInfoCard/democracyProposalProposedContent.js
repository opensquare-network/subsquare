import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";

export default function DemocracyProposalProposedContent({
  proposalIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={proposalIndex} />
      <ProposerItem proposer={data.proposer} />
    </>
  );
}
