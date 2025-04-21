import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
import { createContext, useContext } from "react";

const PeopleIdentityContext = createContext();

export default PeopleIdentityContext;

export function PeopleIdentityProvider({ children }) {
  const { result, isLoading } = useSubMyIdentityInfo();

  return (
    <PeopleIdentityContext.Provider value={{ identityInfo: result, isLoading }}>
      {children}
    </PeopleIdentityContext.Provider>
  );
}

export function usePeopleIdentityContext() {
  return useContext(PeopleIdentityContext) || {};
}
