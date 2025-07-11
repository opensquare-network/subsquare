import { noop } from "lodash-es";
import { createContext, useState, useContext } from "react";

const defaultContext = {
  address: "",
  setAddress: noop,
};

export const AddressContext = createContext(defaultContext);

export default function AddressProvider({ children, address: addressProp }) {
  const [address, setAddress] = useState(addressProp);
  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  return useContext(AddressContext)?.address;
}

export function useSetAddress() {
  return useContext(AddressContext)?.setAddress;
}
