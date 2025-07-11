import { createContext, useState, useContext } from "react";

export const RootAddressContext = createContext(null);

export default function RootAddressProvider({
  children,
  rootAddress: rootAddressProp,
}) {
  const [rootAddress, setRootAddress] = useState(rootAddressProp);
  return (
    <RootAddressContext.Provider value={{ rootAddress, setRootAddress }}>
      {children}
    </RootAddressContext.Provider>
  );
}

export function useRootAddress() {
  return useContext(RootAddressContext) || {};
}
