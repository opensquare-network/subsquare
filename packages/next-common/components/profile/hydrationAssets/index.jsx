import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useHydrationBalance } from "next-common/components/profile/hydrationAssets/context/hydrationBalanceContext";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import Link from "next-common/components/link";

export default function ProfileHydrationAssets() {
  const { balance, showHydrationAssets } = useHydrationBalance();
  const address = useProfileAddress();
  if (!showHydrationAssets) {
    return null;
  }

  return (
    <SecondaryCard>
      <GreyPanel className="text14Medium text-gray500 py-2.5 px-4 max-w-full mb-4 max-sm:!block flex-wrap">
        <AddressUser add={address} className="mr-1" />
        holds assets on Hydration. Check all details
        <Link
          href={`https://app.hydration.net/wallet/assets?account=${address}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-theme500 underline ml-1"
        >
          here
        </Link>
        .
      </GreyPanel>
      <SummaryLayout>
        <SummaryItem title="Total Balance">
          <ValueDisplay value={balance || 0} symbol="" prefix="$" />
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
