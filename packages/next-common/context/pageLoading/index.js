import { createContext, useContext, useState, useCallback } from "react";
import PageLoading from "next-common/components/pageLoading";

const PageLoadingContext = createContext(null);

export default function PageLoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const setPageLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  return (
    <PageLoadingContext.Provider value={{ setPageLoading }}>
      {children}
      <PageLoading isLoading={isLoading} />
    </PageLoadingContext.Provider>
  );
}

export function usePageLoading() {
  const context = useContext(PageLoadingContext);
  return context;
}
