import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import { CHAIN } from "next-common/utils/constants";
import Link from "next-common/components/link";

export default function ProfileTreasurySummary() {
  const { beneficiariesSummary } = usePageProps();

  return (
    <SecondaryCard>
      <GreyPanel className="text14Medium text-gray500 py-2.5 px-4 max-w-full mb-4 max-sm:!block flex-wrap">
        <AddressUser add={beneficiariesSummary?.address} className="mr-1" />
        is a beneficiary of {CHAIN} treasury. Check all beneficiaries
        <Link
          href={`https://${CHAIN}.dotreasury.com/#/beneficiaries`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-theme500 underline ml-1"
        >
          here
        </Link>
        .
      </GreyPanel>
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
