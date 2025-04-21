import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
import { createContext, useContext } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { isRelayChain } from "next-common/utils/chain";
import { CHAIN } from "next-common/utils/constants";

const PeopleIdentityContext = createContext();

export default PeopleIdentityContext;

export function PeopleIdentityProvider({ children }) {
  if (isRelayChain(CHAIN)) {
    return <IdentityProvider>{children}</IdentityProvider>;
  }

  return (
    <PeopleIdentityContext.Provider
      value={{ identityInfo: null, isLoading: false }}
    >
      {children}
    </PeopleIdentityContext.Provider>
  );
}

function IdentityProvider({ children }) {
  const { result, isLoading } = useSubMyIdentityInfo();

  return (
    <PeopleIdentityContext.Provider value={{ identityInfo: result, isLoading }}>
      {children}
    </PeopleIdentityContext.Provider>
  );
}

export function usePeopleIdentityContext(address = "") {
  const result = useContext(PeopleIdentityContext) || {};
  const connectedAddress = useRealAddress();

  if (isSameAddress(address, connectedAddress)) {
    return result;
  }

  return null;
}
