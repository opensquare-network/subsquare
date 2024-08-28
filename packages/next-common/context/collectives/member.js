import { createContext, useContext } from "react";

const CollectivesMemberContext = createContext(null);

export default function CollectivesMemberProvider({ children, member }) {
  return (
    <CollectivesMemberContext.Provider value={{ member }}>
      {children}
    </CollectivesMemberContext.Provider>
  );
}

export function useCollectivesMemberContext() {
  return useContext(CollectivesMemberContext);
}
