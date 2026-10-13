import { useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { RegionTimeProvider } from "next-common/components/coretime/regions/context";
import PoolSummaryItems from "./summaryItems";
import PoolContributions from "./contributions";
import PoolSizeChart from "./poolSizeChart";
import usePoolData from "./usePoolData";

const PurchaseCreditPopup = dynamicPopup(() => import("./purchaseCreditPopup"));

export default function CoretimePool() {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [days, setDays] = useState(7);
  const [activeTab, setActiveTab] = useState("contributions");

  const {
    systemPool,
    privatePool,
    contributions,
    upcomingIo,
    historyDays,
    historyStep,
    totalPayout,
    minimumCreditPurchase,
    loading,
  } = usePoolData({ days });

  const tabs = [
    {
      label: `Contributions${loading ? "" : ` (${contributions.length})`}`,
      value: "contributions",
      content: (
        <PoolContributions contributions={contributions} loading={loading} />
      ),
    },
    {
      label: "On-demand",
      value: "on-demand",
      content: (
        <PoolSizeChart
          days={days}
          onDaysChange={setDays}
          historyDays={historyDays}
          step={historyStep}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <RegionTimeProvider>
      <div className="space-y-6">
        <SecondaryCard>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text16Bold text-textPrimary">Instant pool</h3>
              <div className="text12Medium text-textTertiary">
                Coretime sold on the on-demand market by the system pool and by
                privately contributed regions
              </div>
            </div>
            <SecondaryButton onClick={() => setIsPurchaseOpen(true)}>
              Purchase credit
            </SecondaryButton>
          </div>
          <div className="mt-4">
            <PoolSummaryItems
              systemPool={systemPool}
              privatePool={privatePool}
              upcomingIo={upcomingIo}
              totalPayout={totalPayout}
              days={days}
              loading={loading}
            />
          </div>
        </SecondaryCard>

        <SecondaryCard>
          <Tabs
            tabs={tabs}
            activeTabValue={activeTab}
            onTabClick={(tab) => setActiveTab(tab.value)}
            tabsListDivider={false}
          />
        </SecondaryCard>

        {isPurchaseOpen && (
          <PurchaseCreditPopup
            minimumCreditPurchase={minimumCreditPurchase}
            onClose={() => setIsPurchaseOpen(false)}
          />
        )}
      </div>
    </RegionTimeProvider>
  );
}
