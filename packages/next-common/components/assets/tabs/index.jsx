import React, { useState, useCallback, memo } from "react";
import TabsList from "next-common/components/tabsList";

const TABS = Object.freeze({
  assets: 1,
  transfers: 2,
});

const TabLabel = ({ label, count, isActive }) => (
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

const AssetHubTabs = ({ children }) => {
  const [activeTabId, setActiveTabId] = useState(TABS.assets);
  const [totalCounts, setTotalCounts] = useState({
    assets: "",
    transfers: "",
  });

  const setTotalCount = useCallback((tabKey, count) => {
    setTotalCounts((prevCounts) => {
      if (prevCounts[tabKey] !== count) {
        return {
          ...prevCounts,
          [tabKey]: count,
        };
      }
      return prevCounts;
    });
  }, []);

  const tabsListItems = [
    {
      id: TABS.assets,
      label: (
        <TabLabel
          label="Assets"
          count={totalCounts.assets}
          isActive={activeTabId === TABS.assets}
        />
      ),
    },
    {
      id: TABS.transfers,
      label: (
        <TabLabel
          label="Transfers"
          count={totalCounts.transfers}
          isActive={activeTabId === TABS.transfers}
        />
      ),
    },
  ];

  return (
    <>
      <TabsList
        tabs={tabsListItems}
        onTabClick={(item) => setActiveTabId(item.id)}
        className="pl-6"
      />
      {React.Children.map(children, (child, index) => {
        const tabKey = Object.keys(TABS)[index];
        const isActive = activeTabId === TABS[tabKey];

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
};

export default memo(AssetHubTabs);
