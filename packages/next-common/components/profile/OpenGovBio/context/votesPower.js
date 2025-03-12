import { useContext, createContext } from "react";
import useQueryVotesPower from "next-common/components/profile/OpenGovBio/hooks/useQueryVotesPower";

const OpenGovVotesPowerContext = createContext();

export default function OpenGovVotesPowerProvider({ children, address }) {
  const { result, isLoading } = useQueryVotesPower(address);
  const {
    selfBalance = 0,
    maxDelegations = 0,
    votesPower = 0,
    tracks = null,
  } = result || {};

  return (
    <OpenGovVotesPowerContext.Provider
      value={{
        address,
        isLoading,
        selfBalance,
        maxDelegations,
        votesPower,
        tracks,
      }}
    >
      {children}
    </OpenGovVotesPowerContext.Provider>
  );
}

export function useOpenGovVotesPowerContext() {
  const context = useContext(OpenGovVotesPowerContext);
  return context || {};
}
