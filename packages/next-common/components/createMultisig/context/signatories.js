import { createContext, useCallback, useState, useContext } from "react";

export const SignatoriesContext = createContext({
  signatories: [],
  setSignatories: () => {},
});

export function SignatoriesProvider({ children }) {
  const [signatories, setSignatories] = useState([]);

  const setSignatory = useCallback((address, index) => {
    setSignatories((prev) => {
      const newSignatories = [...prev];
      newSignatories[index] = address;
      return newSignatories;
    });
  }, []);

  const addSignatory = useCallback(() => {
    setSignatories((prev) => [...prev, ""]);
  }, []);

  const removeSignatory = useCallback((index) => {
    setSignatories((prev) => {
      const newSignatories = [...prev];
      newSignatories.splice(index, 1);
      return newSignatories;
    });
  }, []);

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
