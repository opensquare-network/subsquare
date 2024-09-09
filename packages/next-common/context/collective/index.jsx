import { createContext, useContext } from "react";

const CollectiveContext = createContext({});

export default function CollectiveProvider({ children, pallet = "council" }) {
  return (
    <CollectiveContext.Provider value={{ pallet }}>
      {children}
    </CollectiveContext.Provider>
  );
}

export function useCollectiveContext() {
  return useContext(CollectiveContext);
}

export function useCollectivePallet() {
  const { pallet } = useCollectiveContext();
  return pallet;
}
