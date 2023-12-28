import { useEffect } from "react";
import { logoutUser, useUserContext } from "next-common/context/user";
import { CACHE_KEY } from "next-common/utils/constants";

export default function SystemVersionUpgrade({ children }) {
  const userContext = useUserContext();

  useEffect(() => {
    // Detect old storage key
    if (
      localStorage.getItem(CACHE_KEY.lastLoggedInAddress) ||
      localStorage.getItem(CACHE_KEY.lastLoginExtension)
    ) {
      localStorage.removeItem(CACHE_KEY.lastLoggedInAddress);
      localStorage.removeItem(CACHE_KEY.lastLoginExtension);
      // Require user to re-login
      logoutUser(userContext);
    }
  }, [userContext]);

  return children;
}
