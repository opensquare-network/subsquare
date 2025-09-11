import { useContext, createContext } from "react";
import useQueryVotesPower from "next-common/components/profile/democracyBio/hooks/useQueryVotesPower";

const DemocracyVotesPowerContext = createContext();

export default function DemocracyVotesPowerProvider({ children, address }) {
  const { result, isLoading } = useQueryVotesPower(address);
  const { selfBalance = 0, delegations = 0, votesPower = 0 } = result || {};

  return (
    <DemocracyVotesPowerContext.Provider
      value={{
        address,
        isLoading,
        selfBalance,
        delegations,
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
