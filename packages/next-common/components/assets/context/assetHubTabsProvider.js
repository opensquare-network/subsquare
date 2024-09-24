import React, { createContext, useContext, useState, useCallback } from "react";

const AssetHubTabsContext = createContext();

const TABS = Object.freeze({
  assets: 1,
  transfers: 2,
});

export const AssetHubTabsProvider = ({ children }) => {
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

  return (
    <AssetHubTabsContext.Provider
      value={{ activeTabId, setActiveTabId, totalCounts, setTotalCount, TABS }}
    >
      {children}
    </AssetHubTabsContext.Provider>
  );
};

export const useAssetHubTabsContext = () => {
  return useContext(AssetHubTabsContext);
};
