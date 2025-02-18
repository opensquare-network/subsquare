import { createContext, useContext } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useSubStorage from "next-common/hooks/common/useSubStorage";

const MyEvidenceContext = createContext();

export default function MyEvidenceProvider({ children }) {
  const address = useRealAddress();
  const corePallet = useCoreFellowshipPallet();
  const { result: evidence, loading: isLoading } = useSubStorage(
    corePallet,
    "memberEvidence",
    [address],
  );

  return (
    <MyEvidenceContext.Provider value={{ evidence, isLoading }}>
      {children}
    </MyEvidenceContext.Provider>
  );
}

export function useContextMyEvidence() {
  return useContext(MyEvidenceContext);
}
