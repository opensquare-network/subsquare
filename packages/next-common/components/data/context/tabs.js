import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const TabsContext = createContext(null);

const TABS = [
  { tabId: "/proxies", tabTitle: "Proxy", pageTitle: "Proxy Explorer" },
  { tabId: "/vesting", tabTitle: "Vesting", pageTitle: "Vesting Explorer" },
];

export default function DataTabsProvider({ children }) {
  const router = useRouter();
  const pathName = router.pathname;

  const [activeTab, setActiveTab] = useState(pathName);
  const title = TABS.find((tab) => tab.tabId === activeTab)?.pageTitle;

  useEffect(() => {
    if (pathName === activeTab) {
      return;
    }

    setActiveTab(pathName);
  }, [pathName, activeTab]);

  return (
    <TabsContext.Provider value={{ tabs: TABS, activeTab, title }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useDataTabsContext() {
  return useContext(TabsContext);
}
