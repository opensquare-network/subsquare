import { createContext, useContext } from "react";

const CollectivesContext = createContext(null);

export default function CollectivesProvider({
  children,
  section = "fellowship",
  params,
}) {
  return (
    <CollectivesContext.Provider value={{ section, params }}>
      {children}
    </CollectivesContext.Provider>
  );
}

export function useCollectivesContext() {
  return useContext(CollectivesContext);
}

export function useCoreFellowshipPallet() {
  const { section } = useContext(CollectivesContext);
  if ("ambassador" === section) {
    return "ambassadorCore";
  } else if ("fellowship" === section) {
    return "fellowshipCore";
  } else {
    throw new Error(`Can not find pallet name by section: ${section}`);
  }
}

export function useCoreFellowshipParams() {
  const { params } = useContext(CollectivesContext);
  return params;
}
