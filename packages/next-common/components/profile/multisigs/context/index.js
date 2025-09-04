import { createContext, useContext } from "react";
import { fetchMultisigData } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useAsync } from "react-use";

const ProfileMultisigsContext = createContext(null);

export default function ProfileProfileMultisigsProvider({ children }) {
  const address = useProfileAddress();

  const { value, loading } = useAsync(
    async () => await fetchMultisigData(address),
    [address],
  );

  return (
    <ProfileMultisigsContext.Provider
      value={{
        data: value,
        loading,
      }}
    >
      {children}
    </ProfileMultisigsContext.Provider>
  );
}

export function useProfileMultisigsContext() {
  return useContext(ProfileMultisigsContext);
}
