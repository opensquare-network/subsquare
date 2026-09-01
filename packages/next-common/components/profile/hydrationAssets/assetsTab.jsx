"use client";

import LoadableContent from "next-common/components/common/loadableContent";
import Link from "next-common/components/link";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import {
  HydrationAssetsBalanceProvider,
  useHydrationBalanceContext,
} from "next-common/components/profile/hydrationAssets/context/hydrationBalanceContext";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import DynamicAssetsTable from "next-common/components/assethubMigrationAssets/dynamicAssetsTable";
import AssetIcon from "next-common/components/icons/assetIcon";
import useHydrationAssetsList from "next-common/hooks/ecoAssets/hydration/useHydrationAssetsList";
import { abbreviateBigNumber, toPrecision } from "next-common/utils";
import { NATIVE_ASSET_ID } from "next-common/hooks/ecoAssets/hydration/utils/constants";

const columnsDef = [
  {
    name: "Token",
    style: { textAlign: "left", width: "180px", minWidth: "180px" },
    render: (item) => (
      <div
        key="token"
        className="flex items-center gap-[8px] text14Medium text-textPrimary"
      >
        <AssetIcon
          symbol={item.symbol}
          type={item.assetId === NATIVE_ASSET_ID ? "native" : ""}
          className="w-6 h-6"
        />
        <span>{item.symbol || "--"}</span>
      </div>
    ),
  },
  {
    name: "Name",
    style: { textAlign: "left", width: "200px", minWidth: "200px" },
    render: (item) => (
      <span
        key="name"
        className="text14Medium text-textTertiary truncate max-w-[240px]"
      >
        {item.name || "--"}
      </span>
    ),
  },
  {
    name: "Total balance",
    style: { textAlign: "right", minWidth: "160px" },
    render: (item) => (
      <div key="total" className="flex flex-col items-end">
        <ValueDisplay value={toPrecision(item.balance, item.decimals)} />
        {item.fiatValue && (
          <span className="text12Medium text-textTertiary whitespace-nowrap">
            ≈ ${abbreviateBigNumber(item.fiatValue)}
          </span>
        )}
      </div>
    ),
  },
  {
    name: "Transferable balance",
    style: { textAlign: "right", width: "240px", minWidth: "240px" },
    render: (item) => (
      <div key="transferable" className="flex flex-col items-end">
        <ValueDisplay value={toPrecision(item.transferable, item.decimals)} />
        {item.transferableFiatValue && (
          <span className="text12Medium text-textTertiary whitespace-nowrap">
            ≈ ${abbreviateBigNumber(item.transferableFiatValue)}
          </span>
        )}
      </div>
    ),
  },
];

function ProfileHydrationAssetsTabContent() {
  const address = useProfileAddress();
  const { balance, isLoading: balanceLoading } = useHydrationBalanceContext();
  const { assets, isLoading } = useHydrationAssetsList(address);

  return (
    <div className="flex flex-col gap-[16px]">
      <TitleContainer className="justify-start">Summary</TitleContainer>
      <SecondaryCard>
        <SummaryLayout>
          <SummaryItem title="Assets Balance">
            <LoadableContent isLoading={balanceLoading}>
              <ValueDisplay value={balance || 0} symbol="" prefix="$" />
            </LoadableContent>
          </SummaryItem>
        </SummaryLayout>
      </SecondaryCard>

      <TitleContainer className="justify-start">Assets</TitleContainer>
      <SecondaryCard>
        <DynamicAssetsTable
          assets={assets.slice(0, 10)}
          columnsDef={columnsDef}
          loading={isLoading}
          noDataText="No current assets on Hydration"
        />
        {!isLoading && assets.length > 0 && (
          <div className="mt-4 text14Medium text-textTertiary">
            View all assets on Hydration{" "}
            <Link
              href={`https://app.hydration.net/wallet/assets?account=${address}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-theme500 underline ml-1"
            >
              here
            </Link>
          </div>
        )}
      </SecondaryCard>
    </div>
  );
}

export default function ProfileHydrationAssetsTab() {
  return (
    <HydrationAssetsBalanceProvider>
      <ProfileHydrationAssetsTabContent />
    </HydrationAssetsBalanceProvider>
  );
}
