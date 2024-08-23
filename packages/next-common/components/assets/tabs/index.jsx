import React, { useState, useCallback } from "react";
import TabsList from "next-common/components/tabsList";

const tabs = Object.freeze({
  assets: 1,
  transfers: 2,
});

export default function AssetHubTabs({ children }) {
  const [activeTabId, setActiveTabId] = useState(tabs.assets);
  const [totalCounts, setTotalCounts] = useState({
    assets: "",
    transfers: "",
  });

  const setTotalCount = useCallback((tabId, count) => {
    setTotalCounts((prevCounts) => {
      if (prevCounts[tabId] !== count) {
        console.log(`Updating ${tabId} count to:`, count);
        return {
          ...prevCounts,
          [tabId]: count,
        };
      }
      return prevCounts;
    });
  }, []);

  const tabsListItems = [
    {
      id: tabs.assets,
      label: (
        <span
          className={`ml-[16px] font-bold text-[16px] leading-[24px] ${
            activeTabId === tabs.assets
              ? "text-textPrimary"
              : "text-textTertiary"
          }`}
        >
          Assets
          <span className="ml-[4px] font-medium text-[16px] leading-[24px] text-textTertiary">
            {totalCounts.assets}
          </span>
        </span>
      ),
    },
    {
      id: tabs.transfers,
      label: (
        <span
          className={`ml-[16px] font-bold text-[16px] leading-[24px] ${
            activeTabId === tabs.transfers
              ? "text-textPrimary"
              : "text-textTertiary"
          }`}
        >
          Transfers
          <span className="ml-[4px] font-medium text-[16px] leading-[24px] text-textTertiary">
            {totalCounts.transfers}
          </span>
        </span>
      ),
    },
  ];

  return (
    <>
      <TabsList
        tabs={tabsListItems}
        onTabClick={(item) => setActiveTabId(item.id)}
      />
      {React.Children.map(children, (child, index) => {
        const tabId = index + 1;
        const isActive = activeTabId === tabId;
        const tabKey = tabId === tabs.assets ? "assets" : "transfers";

        return (
          <div className={isActive ? "" : "hidden"}>
            {React.cloneElement(child, {
              setTotalCount: (count) => setTotalCount(tabKey, count),
            })}
          </div>
        );
      })}
    </>
  );
}
