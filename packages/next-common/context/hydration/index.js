import { getHydrationApi } from "next-common/utils/hydration";
import { createContext, useContext, useEffect, useState } from "react";

const HydrationApiContext = createContext(null);

export function HydrationApiProvider({ children }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    getHydrationApi().then(setApi);
  }, []);

  return (
    <HydrationApiContext.Provider value={api}>
      {children}
    </HydrationApiContext.Provider>
  );
}

export function useHydrationApi() {
  return useContext(HydrationApiContext);
}
