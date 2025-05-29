import { useContext, createContext } from "react";
import useProfileAvatarPermissions from "next-common/hooks/profile/useProfileAvatarPermissions";

const AvatarPermissionsContext = createContext();

export default function AvatarPermissionsProvider({ children }) {
  const { isSelf, isProxyAccount } = useProfileAvatarPermissions();

  return (
    <AvatarPermissionsContext.Provider
      value={{
        isSelf,
        isProxyAccount,
      }}
    >
      {children}
    </AvatarPermissionsContext.Provider>
  );
}

export function useAvatarPermissionsContext() {
  const context = useContext(AvatarPermissionsContext);
  return context || {};
}
