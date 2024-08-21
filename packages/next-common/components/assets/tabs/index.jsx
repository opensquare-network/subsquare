import React, { useState } from "react";
import TabsList from "next-common/components/tabsList";

const tabs = Object.freeze({
  assets: 1,
  transfers: 2,
});

export default function AssetHubTabs({ children }) {
  const [activeTabId, setActiveTabId] = useState(tabs.assets);
  const [totalCounts, setTotalCounts] = useState({
    assets: 0,
    transfers: 0,
  });

  const setTotalCount = (tabId, count) => {
    setTotalCounts((prevCounts) => ({
      ...prevCounts,
      [tabId]: count,
    }));
  };

  const tabsListItems = [
    {
      id: tabs.assets,
      label: (
        <span
          className={`font-bold text-[16px] leading-[24px] ${
            activeTabId === tabs.assets
              ? "text-textPrimary"
              : "text-textTertiary"
          }`}
        >
          Assets
          <span className="ml-[8px] font-medium text-[16px] leading-[24px] text-textTertiary">
            {totalCounts.assets}
          </span>
        </span>
      ),
    },
    {
      id: tabs.transfers,
      label: (
        <span
          className={`font-bold text-[16px] leading-[24px] ${
            activeTabId === tabs.transfers
              ? "text-textPrimary"
              : "text-textTertiary"
          }`}
        >
          Transfers
          <span className="ml-[8px] font-medium text-[16px] leading-[24px] text-textTertiary">
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
        if (activeTabId === tabs.assets && index === 0) {
          return React.cloneElement(child, {
            setTotalCount: (count) => setTotalCount("assets", count),
          });
        } else if (activeTabId === tabs.transfers && index === 1) {
          return React.cloneElement(child, {
            setTotalCount: (count) => setTotalCount("transfers", count),
          });
        }
        return null;
      })}
    </>
  );
}
