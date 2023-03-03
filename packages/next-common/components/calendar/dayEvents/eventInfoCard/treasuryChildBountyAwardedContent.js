import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ValueItem from "./infoItem/valueItem";

export default function TreasuryChildBountyAwardedContent({
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
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <ValueItem value={data.value} />
      <DescriptionItem description={data.description} />
    </>
  );
}
