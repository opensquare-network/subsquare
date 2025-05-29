import { createContext, useContext } from "react";
import useFetchUserInfo from "next-common/hooks/profile/useFetchUserInfo";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const ProfileUserInfoContext = createContext();

export default function ProfileUserInfoProvider({ children }) {
  const address = useProfileAddress();
  const { user, isLoading, fetch } = useFetchUserInfo(address);

  return (
    <ProfileUserInfoContext.Provider value={{ user, isLoading, fetch }}>
      {children}
    </ProfileUserInfoContext.Provider>
  );
}

export function useProfileUserInfoContext() {
  return useContext(ProfileUserInfoContext);
}
