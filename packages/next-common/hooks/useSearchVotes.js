import useSearchAddressByIdentity from "next-common/hooks/useSearchAddressByIdentity";
import { useMemo } from "react";

const defaultGetVoter = (vote) => vote.account;

export default function useSearchVotes(
  search,
  votes,
  getVoter = defaultGetVoter,
) {
  const voteAccounts = useMemo(() => votes.map(getVoter), [votes, getVoter]);
  const resultByIdentities = useSearchAddressByIdentity(search, voteAccounts);
  return useMemo(() => {
    if (search) {
      return votes.filter((item) => {
        const voter = getVoter(item);
        const hasResultByAddress = voter
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return (
          hasResultByAddress || resultByIdentities.includes(getVoter(item))
        );
      });
    }
    return votes;
  }, [votes, getVoter, search, resultByIdentities]);
}
