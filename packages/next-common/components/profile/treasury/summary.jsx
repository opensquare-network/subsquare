import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";

export default function ProfileTreasurySummary() {
  const { beneficiariesSummary } = usePageProps();

  if (!beneficiariesSummary) {
    return null;
  }

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Total Awarded">
          <ValueDisplay
            value={beneficiariesSummary?.totalBenefitFiatValue || 0}
            symbol=""
            prefix="$"
          />
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
