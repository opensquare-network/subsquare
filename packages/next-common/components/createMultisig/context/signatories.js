import { createContext, useCallback, useState, useContext } from "react";

export const SignatoriesContext = createContext({
  signatories: [],
  setSignatories: () => {},
});

export function SignatoriesProvider({ children }) {
  const [signatories, setSignatories] = useState([]);

  const setSignatory = useCallback(
    (address, index) => {
      signatories[index] = address;
      setSignatories([...signatories]);
    },
    [signatories],
  );

  const addSignatory = useCallback(() => {
    setSignatories([...signatories, ""]);
  }, [signatories]);

  const removeSignatory = useCallback(
    (index) => {
      signatories.splice(index, 1);
      setSignatories([...signatories]);
    },
    [signatories],
  );

  return (
    <SignatoriesContext.Provider
      value={{ signatories, setSignatory, addSignatory, removeSignatory }}
    >
      {children}
    </SignatoriesContext.Provider>
  );
}

export function useSignatories() {
  return useContext(SignatoriesContext);
}
