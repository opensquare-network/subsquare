import { createContext, useContext } from "react";

const MultisigSignContext = createContext(null);

export default function MultisigSignProvider({ children, multisig, setValue }) {
  return (
    <MultisigSignContext.Provider value={{ multisig, setValue }}>
      {children}
    </MultisigSignContext.Provider>
  );
}

export function useMultisigSignContext() {
  return useContext(MultisigSignContext);
}
