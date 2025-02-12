import { createContext, useContext } from "react";

const MultisigSignContext = createContext(null);

export default function MultisigSignProvider({
  children,
  multisig,
  setValue,
  callHash,
}) {
  return (
    <MultisigSignContext.Provider value={{ multisig, setValue, callHash }}>
      {children}
    </MultisigSignContext.Provider>
  );
}

export function useMultisigSignContext() {
  return useContext(MultisigSignContext);
}
