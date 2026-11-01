import { createContext, useContext, useState } from "react";

export const DOT_USD_TABS = [
  { value: "overview", label: "Overview" },
  { value: "holders", label: "Holders" },
  { value: "mint", label: "Mint records" },
  { value: "redeem", label: "Redeem records" },
];

// The tabs are switched in place rather than by url, so the header tabs, the page content and
// the record links of the summary all share the active one from here.
const DotUsdTabsContext = createContext({
  activeTab: DOT_USD_TABS[0].value,
  setActiveTab: () => {},
});

export function DotUsdTabsProvider({ children }) {
  const [activeTab, setActiveTab] = useState(DOT_USD_TABS[0].value);

  return (
    <DotUsdTabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </DotUsdTabsContext.Provider>
  );
}

export function useDotUsdTabs() {
  return useContext(DotUsdTabsContext);
}
