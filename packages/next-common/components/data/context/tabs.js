import { createContext, useContext, useState } from "react";

const TabsContext = createContext(null);

const TABS = [
  { tabId: "proxy", tabTitle: "Proxy", pageTitle: "Proxy Explorer" },
  { tabId: "vesting", tabTitle: "Vesting", pageTitle: "Vesting Explorer" },
];

export default function DataTabsProvider({ children }) {
  const [activeTab, setActiveTab] = useState(TABS[0].tabId);
  const title = TABS.find((tab) => tab.tabId === activeTab)?.pageTitle;

  return (
    <TabsContext.Provider
      value={{ tabs: TABS, activeTab, setActiveTab, title }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useDataTabsContext() {
  return useContext(TabsContext);
}
