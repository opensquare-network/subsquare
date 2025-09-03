import { createContext, useContext } from "react";
import { fetchMultisigData } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useAsync } from "react-use";

const MultisigContext = createContext(null);

export default function MultisigProvider({ children }) {
  const address = useProfileAddress();

  const { value, loading } = useAsync(
    async () => await fetchMultisigData(address),
    [address],
  );

  return (
    <MultisigContext.Provider
      value={{
        data: value,
        loading,
      }}
    >
      {children}
    </MultisigContext.Provider>
  );
}

export function useMultisigContext() {
  return useContext(MultisigContext);
}
