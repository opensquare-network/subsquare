import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import ValueItem from "./infoItem/valueItem";

export default function TreasuryBountyAwardedContent({ bountyIndex, data }) {
  return (
    <>
      <IndexItem index={bountyIndex} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <ValueItem value={data.value} />
      <DescriptionItem description={data.description} />
    </>
  );
}
