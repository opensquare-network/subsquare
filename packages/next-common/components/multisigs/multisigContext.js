import React, { useState, useContext, createContext } from "react";

const MultisigContext = createContext();

export function MultisigContextProvider({ children }) {
  const [isNeedReload, setIsNeedReload] = useState(false);

  return (
    <MultisigContext.Provider value={{ isNeedReload, setIsNeedReload }}>
      {children}
    </MultisigContext.Provider>
  );
}

export function useMultisigContext() {
  const { isNeedReload, setIsNeedReload } = useContext(MultisigContext);
  return { isNeedReload, setIsNeedReload };
}
