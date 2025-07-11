import { createContext, useState, useContext } from "react";

export const SourceAddressContext = createContext(null);

export default function SourceAddressProvider({
  children,
  sourceAddress: sourceAddressProp,
}) {
  const [sourceAddress, setSourceAddress] = useState(sourceAddressProp);
  return (
    <SourceAddressContext.Provider value={{ sourceAddress, setSourceAddress }}>
      {children}
    </SourceAddressContext.Provider>
  );
}

export function useSourceAddress() {
  return useContext(SourceAddressContext) || {};
}
