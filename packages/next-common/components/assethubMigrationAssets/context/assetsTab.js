import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/router";

const AssetsTabContext = createContext(null);

export function AssetsTabProvider({ children, defaultValue = "account" }) {
  const router = useRouter();
  const activeValue = router.query.tab || defaultValue;
  const setActiveValue = useCallback(
    (value) => {
      if (value === activeValue) {
        return;
      }

      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: value },
        },
        undefined,
        { shallow: true },
      );
    },
    [activeValue, router],
  );

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
