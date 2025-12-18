import React from "react";
import TabsList from "next-common/components/tabs/list";
import {
  useActiveTab,
  useTotalCounts,
  TABS,
} from "next-common/components/assethubMigrationAssets/context/assetHubTabsProvider";

export const TabLabel = ({ label, count, isActive }) => (
  <span
    className={`font-bold text-[16px] leading-[24px] ${
      isActive ? "text-textPrimary" : "text-textTertiary"
    }`}
  >
    {label}
    <span className="ml-[4px] font-medium text-[16px] leading-[24px] text-textTertiary">
      {count}
    </span>
  </span>
);

export default function AssetHubTabs({
  children,
  customLabels,
  showHydrationTab = false,
}) {
  const [activeTabId, setActiveTabId] = useActiveTab();
  const [totalCounts] = useTotalCounts();

  const defaultLabels = {
    [TABS.assets]: "Assets",
    [TABS.transfers]: "Transfers",
  };

  const labels = { ...defaultLabels, ...customLabels };

  const tabsListItems = [
    {
      value: TABS.assets,
      label: (
        <TabLabel
          label={labels[TABS.assets]}
          count={totalCounts.assets}
          isActive={activeTabId === TABS.assets}
        />
      ),
    },
    {
      value: TABS.transfers,
      label: (
        <TabLabel
          label={labels[TABS.transfers]}
          count={totalCounts.transfers}
          isActive={activeTabId === TABS.transfers}
        />
      ),
    },
  ];

  if (showHydrationTab) {
    tabsListItems.push({
      value: TABS.hydration,
      label: (
        <TabLabel
          label={labels[TABS.hydration]}
          isActive={activeTabId === TABS.hydration}
        />
      ),
    });
  }

  return (
    <>
      <TabsList
        tabs={tabsListItems}
        onTabClick={(item) => setActiveTabId(item.value)}
        className="pl-6"
      />
      {React.Children.map(children, (child, index) => {
        const tabKey = Object.keys(TABS)[index];
        const isActive = activeTabId === TABS[tabKey];

        return <div className={isActive ? "" : "hidden"}>{child}</div>;
      })}
    </>
  );
}
