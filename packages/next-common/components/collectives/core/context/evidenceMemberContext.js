import useAllCollectiveMemberEvidence from "next-common/hooks/useAllCollectiveMemberEvidence";
import { createContext, useContext } from "react";

const AllMemberEvidenceContext = createContext();

export default AllMemberEvidenceContext;

export function AllMemberEvidenceProvider({ children }) {
  const { evidences, isLoading } = useAllCollectiveMemberEvidence();
  return (
    <AllMemberEvidenceContext.Provider value={{ evidences, isLoading }}>
      {children}
    </AllMemberEvidenceContext.Provider>
  );
}

export function useAllMemberEvidenceContext() {
  return useContext(AllMemberEvidenceContext);
}
