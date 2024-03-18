import React, { useContext } from "react";

const AvatarContext = React.createContext();

export default AvatarContext;

export function AvatarContextProvider({ addressAvatarMap, children }) {
  return (
    <AvatarContext.Provider value={{ addressAvatarMap }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAddressAvatarMap() {
  const { addressAvatarMap } = useContext(AvatarContext) || {};
  return addressAvatarMap;
}
