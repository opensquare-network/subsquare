import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const MultisigSignContext = createContext(null);

const defaultCallData = {
  input: { callData: null, isValid: false },
  set: { callData: null, isValid: false },
  tree: { callData: null, isValid: false },
};

export default function MultisigSignProvider({ children, multisig }) {
  // input/set/tree
  const [formType, setFormType] = useState("input");
  const [callDataMap, setCallDataMap] = useState(defaultCallData);

  const setCallData = useCallback((type, data) => {
    setCallDataMap((prev) => ({
      ...prev,
      [type]: data,
    }));
  }, []);

  const stableSetFormType = useCallback((type) => {
    setFormType(type);
  }, []);

  useEffect(() => {
    return () => {
      setCallDataMap(defaultCallData);
    };
  }, []);

  return (
    <MultisigSignContext.Provider
      value={{
        multisig,
        formType,
        setFormType: stableSetFormType,
        callDataMap,
        setCallData,
      }}
    >
      {children}
    </MultisigSignContext.Provider>
  );
}

export function useMultisigSignContext() {
  return useContext(MultisigSignContext);
}
