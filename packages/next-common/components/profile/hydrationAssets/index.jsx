"use client";

import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useHydrationBalanceContext } from "next-common/components/profile/hydrationAssets/context/hydrationBalanceContext";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import Link from "next-common/components/link";
import { HydrationBalanceProvider } from "next-common/components/profile/hydrationAssets/context/hydrationBalanceContext";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import useSupportHydrationAssets from "./useSupportHydrationAssets";
import Loading from "next-common/components/loading";
import NoData from "next-common/components/noData";

function ProfileHydrationAssetsLoading() {
  return (
    <div className="flex justify-center items-center h-full py-[24px]">
      <Loading size="20" />
    </div>
  );
}

function ProfileHydrationAssetsContent() {
  const address = useProfileAddress();
  const { balance } = useHydrationBalanceContext();

  return (
    <>
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
    </>
  );
}

function ProfileHydrationAssetsImpl() {
  const { hasBalance, isLoading } = useHydrationBalanceContext();
  if (isLoading) {
    return <ProfileHydrationAssetsLoading />;
  }

  if (!hasBalance) {
    return <NoData showIcon={false} text="No current assets on Hydration" />;
  }

  return <ProfileHydrationAssetsContent />;
}

export default function ProfileHydrationAssets() {
  const supportHydrationAssets = useSupportHydrationAssets();
  if (!supportHydrationAssets) {
    return null;
  }

  return (
    <HydrationBalanceProvider>
      <TitleContainer>Hydration</TitleContainer>
      <SecondaryCard>
        <ProfileHydrationAssetsImpl />
      </SecondaryCard>
    </HydrationBalanceProvider>
  );
}
