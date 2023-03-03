import BeneficiaryItem from "./infoItem/beneficiaryItem";
import DescriptionItem from "./infoItem/descriptionItem";
import IndexItem from "./infoItem/indexItem";
import PayoutItem from "./infoItem/payoutItem";

export default function TreasuryBountyContent({ bountyIndex, data }) {
  return (
    <>
      <IndexItem index={bountyIndex} />
      <BeneficiaryItem beneficiary={data.beneficiary} />
      <PayoutItem payout={data.payout} />
      <DescriptionItem description={data.description} />
    </>
  );
}
