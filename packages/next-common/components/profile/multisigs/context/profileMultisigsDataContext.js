import { createContext, useContext } from "react";
import { fetchMultisigDataFromGraphql } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useAsync } from "react-use";

const ProfileMultisigsDataContext = createContext(null);

export default function ProfileMultisigsDataProvider({ children }) {
  const address = useProfileAddress();

  const { value, loading } = useAsync(
    async () => await fetchMultisigDataFromGraphql(address),
    [address],
  );

  return (
    <ProfileMultisigsDataContext.Provider
      value={{
        data: value,
        loading,
      }}
    >
      {children}
    </ProfileMultisigsDataContext.Provider>
  );
}

export function useProfileMultisigsDataContext() {
  return useContext(ProfileMultisigsDataContext);
}
