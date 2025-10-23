import { createContext, useContext, useMemo } from "react";
import useUserMultisigsActiveCount from "next-common/hooks/multisig/useUserMultisigsActiveCount";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { useChainSettings } from "next-common/context/chain";

const ProfileMultisigsActiveContext = createContext();

function Provider({ children }) {
  const address = useProfileAddress();
  const {
    total: activeCountAsMultisig,
    isLoading: isActiveCountAsMultisigLoading,
  } = useUserMultisigsActiveCount({ address, queryType: "multisig" });
  const {
    total: activeCountAsSignatory,
    isLoading: isActiveCountAsSignatoryLoading,
  } = useUserMultisigsActiveCount({ address, queryType: "signatory" });

  const activeCount = useMemo(() => {
    return activeCountAsMultisig + activeCountAsSignatory;
  }, [activeCountAsMultisig, activeCountAsSignatory]);

  return (
    <ProfileMultisigsActiveContext.Provider
      value={{
        activeCount,
        activeCountAsMultisig,
        activeCountAsSignatory,
        isActiveCountAsMultisigLoading,
        isActiveCountAsSignatoryLoading,
      }}
    >
      {children}
    </ProfileMultisigsActiveContext.Provider>
  );
}

export default function ProfileMultisigsActiveProvider({ children }) {
  const address = useProfileAddress();
  const { hasMultisig } = useChainSettings();

  if (!isPolkadotAddress(address) || !hasMultisig) {
    return (
      <ProfileMultisigsActiveContext.Provider
        value={{
          activeCount: 0,
          activeCountAsMultisig: 0,
          activeCountAsSignatory: 0,
          isActiveCountAsMultisigLoading: false,
          isActiveCountAsSignatoryLoading: false,
        }}
      >
        {children}
      </ProfileMultisigsActiveContext.Provider>
    );
  }

  return (
    <Provider>{children}</Provider>
  );
}

export function useProfileMultisigsActiveContext() {
  return useContext(ProfileMultisigsActiveContext);
}
