import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
import { createContext, useContext } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useChain } from "next-common/context/chain";
import {
  isKusamaChain,
  isPolkadotChain,
  isPaseoChain,
} from "next-common/utils/chain";

const PeopleIdentityContext = createContext();

export default PeopleIdentityContext;

export function PeopleIdentityProvider({ children }) {
  const chain = useChain();

  if (isKusamaChain(chain) || isPolkadotChain(chain) || isPaseoChain(chain)) {
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
    return result || null;
  }

  return null;
}
