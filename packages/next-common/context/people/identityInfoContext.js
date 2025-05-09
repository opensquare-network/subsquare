import { createContext, useContext } from "react";
import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";

const IdentityInfoContext = createContext(null);

export default function IdentityInfoProvider({ children }) {
  const { info, judgements, isLoading } = useSubMyIdentityInfo();

  return (
    <IdentityInfoContext.Provider value={{ info, judgements, isLoading }}>
      {children}
    </IdentityInfoContext.Provider>
  );
}

export function useIdentityInfoContext() {
  return useContext(IdentityInfoContext);
}
