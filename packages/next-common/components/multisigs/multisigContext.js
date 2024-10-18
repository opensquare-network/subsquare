import React, { useState, useContext, createContext } from "react";

const MultisigContext = createContext();

export function MultisigContextProvider({ children }) {
  const [isNeedReload, setIsNeedReload] = useState(false);
  const [isRefetchCount, setIsRefetchCount] = useState(false);

  return (
    <MultisigContext.Provider
      value={{
        isNeedReload,
        setIsNeedReload,
        isRefetchCount,
        setIsRefetchCount,
      }}
    >
      {children}
    </MultisigContext.Provider>
  );
}

export function useMultisigContext() {
  return useContext(MultisigContext);
}
