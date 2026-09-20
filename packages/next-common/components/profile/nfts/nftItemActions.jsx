import { createContext, useContext } from "react";

const NftItemActionsContext = createContext(null);

// Injects a component rendered at the end of every item row, it receives
// `collectionId` and `itemId` props.
export function NftItemActionsProvider({ actions, children }) {
  return (
    <NftItemActionsContext.Provider value={actions}>
      {children}
    </NftItemActionsContext.Provider>
  );
}

export function useNftItemActions() {
  return useContext(NftItemActionsContext);
}
