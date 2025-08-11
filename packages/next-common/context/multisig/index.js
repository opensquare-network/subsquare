import { createContext, useContext, useState } from "react";

const MultisigContext = createContext(null);

export function MultisigProvider({ children, multisig: multisigProp }) {
  const [multisig, setMultisig] = useState(multisigProp);

  return (
    <MultisigContext.Provider value={{ multisig, setMultisig }}>
      {children}
    </MultisigContext.Provider>
  );
}

export function useMultisigContext() {
  return useContext(MultisigContext);
}
