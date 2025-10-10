import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import Link from "next/link";

export default function ProfileTreasurySummary() {
  const { beneficiariesSummary } = usePageProps();

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Total Awarded">
          <ValueDisplay
            value={beneficiariesSummary?.totalBenefitFiatValue || 0}
            symbol=""
            prefix="$"
          />
          <p className="text12Medium text-textTertiary !ml-0">
            Check all beneficiaries{" "}
            <Link
              href="https://kusama.dotreasury.com/#/beneficiaries"
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-theme500 underline"
            >
              here
            </Link>
            .{" "}
          </p>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
