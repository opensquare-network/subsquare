import { createContext, useContext } from "react";
import useAddressVestingData from "next-common/hooks/useAddressVestingData";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const ProfileVestingContext = createContext({
  data: null,
  isLoading: true,
  update: () => {},
});

export function ProfileVestingProvider({ children }) {
  const address = useProfileAddress();
  const vestingData = useAddressVestingData(address);

  return (
    <ProfileVestingContext.Provider value={vestingData}>
      {children}
    </ProfileVestingContext.Provider>
  );
}

export function useProfileVestingContext() {
  return useContext(ProfileVestingContext);
}
