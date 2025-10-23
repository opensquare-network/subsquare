import { useEffect } from "react";
import { logoutUser, useUserContext } from "next-common/context/user";
import { CACHE_KEY } from "next-common/utils/constants";
import safeLocalStorage from "next-common/utils/safeLocalStorage";

export default function SystemVersionUpgrade({ children }) {
  const userContext = useUserContext();

  useEffect(() => {
    // Detect old storage key
    if (
      safeLocalStorage.getItem(CACHE_KEY.lastLoggedInAddress) ||
      safeLocalStorage.getItem(CACHE_KEY.lastLoginExtension)
    ) {
      safeLocalStorage.removeItem(CACHE_KEY.lastLoggedInAddress);
      safeLocalStorage.removeItem(CACHE_KEY.lastLoginExtension);
      // Require user to re-login
      logoutUser(userContext);
    }
  }, [userContext]);

  return children;
}
