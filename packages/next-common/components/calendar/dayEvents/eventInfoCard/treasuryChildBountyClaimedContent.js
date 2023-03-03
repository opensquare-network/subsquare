import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import PayoutItem from "./infoItem/payoutItem";

export default function TreasuryChildBountyClaimedContent({
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
      <PayoutItem payout={data.payout} />
      <DescriptionItem description={data.description} />
    </>
  );
}
