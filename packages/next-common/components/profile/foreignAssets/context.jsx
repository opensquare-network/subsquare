import { createContext, useContext, useMemo } from "react";
import useProfileForeignAssets from "./useProfileForeignAssets";

const ProfileForeignAssetsContext = createContext(null);

export function ProfileForeignAssetsProvider({ children, address }) {
  const { assets, loading } = useProfileForeignAssets(address);

  const contextValue = useMemo(() => {
    const count = loading ? 0 : assets?.length || 0;

    return {
      assets,
      loading,
      count,
    };
  }, [assets, loading]);

  return (
    <ProfileForeignAssetsContext.Provider value={contextValue}>
      {children}
    </ProfileForeignAssetsContext.Provider>
  );
}

export function useProfileForeignAssetsContext() {
  return useContext(ProfileForeignAssetsContext);
}
