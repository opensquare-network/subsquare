import { useContext, createContext } from "react";
import useQueryVotesPower from "next-common/components/profile/democracyBio/hooks/useQueryVotesPower";

const DemocracyVotesPowerContext = createContext();

export default function DemocracyVotesPowerProvider({ children, address }) {
  const { result, isLoading } = useQueryVotesPower(address);
  const { selfBalance = 0, maxDelegations = 0, votesPower = 0 } = result || {};

  return (
    <DemocracyVotesPowerContext.Provider
      value={{
        address,
        isLoading,
        selfBalance,
        maxDelegations,
        votesPower,
      }}
    >
      {children}
    </DemocracyVotesPowerContext.Provider>
  );
}

export function useDemocracyVotesPowerContext() {
  const context = useContext(DemocracyVotesPowerContext);
  return context || {};
}
