import useSearchAddressByIdentity from "next-common/hooks/useSearchAddressByIdentity";
import { useMemo } from "react";

const defaultGetVoter = (vote) => vote.account;

export default function useSearchVotes(
  search,
  votes,
  getVoter = defaultGetVoter,
) {
  const voteAccounts = useMemo(
    () => votes.map(getVoter).filter(Boolean),
    [votes, getVoter],
  );
  const resultByIdentities = useSearchAddressByIdentity(search, voteAccounts);
  return useMemo(() => {
    if (!search) {
      return votes;
    }
    return votes.filter((item) => {
      const voter = getVoter(item);
      if (!voter) {
        return false;
      }
      const hasResultByAddress = voter
        .toLowerCase()
        .includes(search.toLowerCase());
      const hasResultByIdentity = resultByIdentities.includes(voter);
      return hasResultByAddress || hasResultByIdentity;
    });
  }, [votes, getVoter, search, resultByIdentities]);
}
