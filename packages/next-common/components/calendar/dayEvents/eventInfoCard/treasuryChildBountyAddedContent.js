import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ProposerItem from "./infoItem/proposerItem";
import ValueItem from "./infoItem/valueItem";

export default function TreasuryChildBountyAddedContent({
  childBountyIndex,
  data,
}) {
  return (
    <>
      <IndexItem index={childBountyIndex} />
      <IndexItem
        index={data.parentBountyIndex}
        indexName="Parent bounty index"
      />
      <ProposerItem proposer={data.proposer} />
      <ValueItem value={data.value} />
      <DescriptionItem description={data.description} />
    </>
  );
}
