import { createContext, useContext } from "react";

const CollectivesMemberContext = createContext(null);

export default function CollectivesMemberProvider({
  children,
  section,
  params,
  member,
}) {
  return (
    <CollectivesMemberContext.Provider value={{ section, params, member }}>
      {children}
    </CollectivesMemberContext.Provider>
  );
}

export function useCollectivesMemberContext() {
  return useContext(CollectivesMemberContext);
}
