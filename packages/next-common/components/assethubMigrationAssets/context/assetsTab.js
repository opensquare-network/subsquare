import { createContext, useContext, useState } from "react";

const AssetsTabContext = createContext(null);

export function AssetsTabProvider({ children, defaultValue = "account" }) {
  const [activeValue, setActiveValue] = useState(defaultValue);

  const value = {
    activeValue,
    setActiveValue,
  };

  return (
    <AssetsTabContext.Provider value={value}>
      {children}
    </AssetsTabContext.Provider>
  );
}

export function useAssetsTab() {
  const context = useContext(AssetsTabContext);
  return context || {};
}
