import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";

export default function TreasuryChildBountyCanceledContent({
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
      <DescriptionItem description={data.description} />
    </>
  );
}
