import { createContext, useContext } from "react";
import useAllVestingData from "next-common/components/data/vesting/hooks/useAllVestingData";

const VestingContext = createContext({
  data: [],
  isLoading: true,
  sortField: "unlockable",
  sortDirection: "desc",
  onSort: () => {},
  update: () => {},
});

export function VestingProvider({ children }) {
  const vestingData = useAllVestingData();

  return (
    <VestingContext.Provider value={vestingData}>
      {children}
    </VestingContext.Provider>
  );
}

export function useVestingContext() {
  return useContext(VestingContext);
}
