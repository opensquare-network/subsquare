import { useState } from "react";
import { ArrowDown, ArrowUp } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import HydrationTreasurySummary from "next-common/components/summary/hydrationTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import useHydrationTreasuryAssets from "next-common/hooks/useHydrationTreasuryAssets";
import { HydrationSDKProvider } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";
import { cn } from "next-common/utils";
import HydrationAssetBalance from "./assetBalance";

function HydrationAssetBalancePanel({ data, isLoading }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const Icon = isCollapsed ? ArrowDown : ArrowUp;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <HydrationTreasurySummary data={data} isLoading={isLoading} />
        <button
          type="button"
          className="flex items-center justify-center shrink-0 border rounded-[8px] w-8 h-8 cursor-pointer bg-neutral200"
          onClick={toggleCollapse}
        >
          <Icon className="w-5 h-5 [&_path]:stroke-textSecondary" />
        </button>
      </div>
      <Divider className={cn(isCollapsed && "hidden")} />
      {!isCollapsed && (
        <HydrationAssetBalance data={data} isLoading={isLoading} />
      )}
    </div>
  );
}

function HydrationTreasuryStatsContent() {
  const { data, isLoading } = useHydrationTreasuryAssets();

  return <HydrationAssetBalancePanel data={data} isLoading={isLoading} />;
}

export default function HydrationTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>
      <SecondaryCard className="flex flex-col gap-y-6">
        <TreasuryProvider>
          <HydrationSDKProvider>
            <HydrationTreasuryStatsContent />
          </HydrationSDKProvider>
        </TreasuryProvider>
      </SecondaryCard>
    </div>
  );
}
