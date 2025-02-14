import { createContext, useContext } from "react";
import useMyMemberEvidence from "../hooks/useMyMemberEvidence";

const MyEvidenceContext = createContext();

export default function MyEvidenceProvider({ children }) {
  const { evidence, isLoading } = useMyMemberEvidence();

  return (
    <MyEvidenceContext.Provider value={{ evidence, isLoading }}>
      {children}
    </MyEvidenceContext.Provider>
  );
}

export function useContextMyEvidence() {
  return useContext(MyEvidenceContext);
}
