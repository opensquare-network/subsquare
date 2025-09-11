import { useChainSettings } from "next-common/context/chain";
import IdentityInfoProvider from "next-common/context/people/identityInfoContext";
import { clearCachedIdentitys } from "next-common/services/identity";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";

export default function PeopleCommonProvider({ children }) {
  const { identity: identityChain } = useChainSettings();
  const realAddress = useRealAddress();

  useEffect(() => {
    return () => {
      clearCachedIdentitys([{ chain: identityChain, address: realAddress }]);
    };
  }, [identityChain, realAddress]);

  return <IdentityInfoProvider>{children}</IdentityInfoProvider>;
}
