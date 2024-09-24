import React, { createContext, useContext, useState, useCallback } from "react";

const TABS = Object.freeze({
  assets: 1,
  transfers: 2,
});

const AssetHubTabsContext = createContext();

export const useAssetHubTabsContext = () => useContext(AssetHubTabsContext);

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
      value={{ activeTabId, setActiveTabId, totalCounts, setTotalCount }}
    >
      {children}
    </AssetHubTabsContext.Provider>
  );
};
