import { createContext, useContext } from "react";

export const FellowshipEvidenceContext = createContext({
  who: "",
});

export function FellowshipEvidenceProvider({ who, children }) {
  return (
    <FellowshipEvidenceContext.Provider value={{ who }}>
      {children}
    </FellowshipEvidenceContext.Provider>
  );
}

export function useFellowshipEvidence() {
  return useContext(FellowshipEvidenceContext);
}
