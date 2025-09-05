import { createContext, useContext, useMemo } from "react";
import useUserMultisigsActiveCount from "next-common/hooks/multisig/useUserMultisigsActiveCount";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { useChainSettings } from "next-common/context/chain";

const ProfileMultisigsInfoContext = createContext();

function ProfileMultisigsInfoProvider({ children }) {
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
    <ProfileMultisigsInfoContext.Provider
      value={{
        activeCount,
        activeCountAsMultisig,
        activeCountAsSignatory,
        isActiveCountAsMultisigLoading,
        isActiveCountAsSignatoryLoading,
      }}
    >
      {children}
    </ProfileMultisigsInfoContext.Provider>
  );
}

function ConditionalProfileMultisigsInfoProvider({ children }) {
  const address = useProfileAddress();
  const { hasMultisig } = useChainSettings();

  if (!isPolkadotAddress(address) || !hasMultisig) {
    return (
      <ProfileMultisigsInfoContext.Provider
        value={{
          activeCount: 0,
          activeCountAsMultisig: 0,
          activeCountAsSignatory: 0,
          isActiveCountAsMultisigLoading: false,
          isActiveCountAsSignatoryLoading: false,
        }}
      >
        {children}
      </ProfileMultisigsInfoContext.Provider>
    );
  }

  return (
    <ProfileMultisigsInfoProvider>{children}</ProfileMultisigsInfoProvider>
  );
}

export default ConditionalProfileMultisigsInfoProvider;

export function useProfileMultisigsInfoContext() {
  return useContext(ProfileMultisigsInfoContext);
}
