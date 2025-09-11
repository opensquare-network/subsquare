import { getCollectivesApi } from "next-common/utils/collectives";
import { createContext, useContext, useEffect, useState } from "react";

const CollectivesApiContext = createContext(null);

export function CollectivesApiProvider({ children }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    getCollectivesApi().then(setApi);
  }, []);

  return (
    <CollectivesApiContext.Provider value={api}>
      {children}
    </CollectivesApiContext.Provider>
  );
}

export function useCollectivesApi() {
  return useContext(CollectivesApiContext);
}
