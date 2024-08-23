import React, { useState } from "react";
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
          className={`ml-[24px] font-bold text-[16px] leading-[24px] ${
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
          className={`font-bold text-[16px] leading-[24px] ${
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
      {React.Children.map(children, (child, index) => (
        <div className={`${activeTabId === index + 1 ? "" : "hidden"}`}>
          {React.cloneElement(child, {
            setTotalCount: (count) =>
              setTotalCount(Object.keys(tabs)[index], count),
          })}
        </div>
      ))}
    </>
  );
}
