import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";

const TabsContext = createContext(null);

function generateTabs() {
  const { modules } = getChainSettings(CHAIN);

  let TABS = [];
  if (modules?.proxy) {
    TABS.push({
      tabId: "/proxies",
      tabTitle: "Proxy",
      pageTitle: "Proxy Explorer",
    });
  }

  if (modules?.vesting) {
    TABS.push({
      tabId: "/vesting",
      tabTitle: "Vesting",
      pageTitle: "Vesting Explorer",
    });
  }
  return TABS;
}

export default function DataTabsProvider({ children }) {
  const router = useRouter();
  const pathName = router.pathname;
  const tabs = generateTabs();

  const [activeTab, setActiveTab] = useState(pathName);
  const title = tabs.find((tab) => tab.tabId === activeTab)?.pageTitle;

  useEffect(() => {
    if (pathName === activeTab) {
      return;
    }

    setActiveTab(pathName);
  }, [pathName, activeTab]);

  return (
    <TabsContext.Provider value={{ tabs, activeTab, title }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useDataTabsContext() {
  return useContext(TabsContext);
}
