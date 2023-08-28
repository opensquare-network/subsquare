import useSearchAddressByIdentity from "next-common/hooks/useSearchAddressByIdentity";
import { useMemo } from "react";

const defaultGetVoter = (vote) => vote.account;

export default function useSearchVotes(
  search,
  votes,
  getVoter = defaultGetVoter,
) {
  const voteAccounts = useMemo(() => votes.map(getVoter), [votes, getVoter]);
  const searchAddresses = useSearchAddressByIdentity(search, voteAccounts);
  const filteredVotes = useMemo(() => {
    if (search) {
      return votes.filter(
        (item) =>
          getVoter(item).toLowerCase().includes(search.toLowerCase()) ||
          searchAddresses.includes(getVoter(item)),
      );
    }
    return votes;
  }, [votes, getVoter, search, searchAddresses]);

  return filteredVotes;
}
