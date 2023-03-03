import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import ValueItem from "./infoItem/valueItem";

export default function TreasuryBountyProposedContent({ bountyIndex, data }) {
  return (
    <>
      <IndexItem index={bountyIndex} />
      <ProposerItem proposer={data.proposer} />
      <ValueItem value={data.value} />
      <DescriptionItem description={data.description} />
    </>
  );
}
