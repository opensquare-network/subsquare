import { useEffect, useState } from "react";
import { orderBy } from "lodash-es";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import useRankedCollectiveMinRank from "next-common/hooks/collectives/useRankedCollectiveMinRank";
import { isSameAddress } from "next-common/utils";
import { encodeAddress } from "@polkadot/util-crypto";
import { useFellowshipVotesContext } from "next-common/context/collectives/fellowshipVotes";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

function getMemberVotes(rank, minRank) {
  if (rank < minRank) {
    throw new Error(`Rank ${rank} is too low, and minimum rank is ${minRank}`);
  }
  const excess = rank - minRank;
  const v = excess + 1;
  return Math.floor((v * (v + 1)) / 2);
}

export default function useCollectiveEligibleVoters() {
  const api = useConditionalContextApi();

  const [voters, setVoters] = useState({
    votedMembers: [],
    unVotedMembers: [],
  });
  const [loading, setLoading] = useState(true);

  const minRank = useRankedCollectiveMinRank();

  const {
    votes: { allAye, allNay },
    isLoading: isLoadingVotes,
  } = useFellowshipVotesContext();

  useEffect(() => {
    if (!api || isLoadingVotes) {
      return;
    }

    (async () => {
      try {
        const memberEntries =
          await api.query.fellowshipCollective.members.entries();
        const normalizedMembers =
          normalizeRankedCollectiveEntries(memberEntries);
        const voters = normalizedMembers.filter(
          (member) => member?.rank >= minRank,
        );
        const sortedVoters = orderBy(voters, ["rank"], ["desc"]);
        const votersWithPower = sortedVoters.map((m) => ({
          ...m,
          votes: getMemberVotes(m.rank, minRank),
        }));

        const allVotes = [...allAye, ...allNay];
        const votedSet = new Set(allVotes.map((i) => encodeAddress(i.address)));
        const votedMembers = votersWithPower.filter((m) =>
          votedSet.has(encodeAddress(m.address)),
        );
        const unVotedMembers = votersWithPower.filter(
          (m) => !votedSet.has(encodeAddress(m.address)),
        );
        setVoters({
          votedMembers: votedMembers.map((m) => {
            const vote = allVotes.find((i) =>
              isSameAddress(i.address, m.address),
            );
            return {
              ...m,
              votes: vote.votes,
              isAye: vote.isAye,
            };
          }),
          unVotedMembers,
        });
      } catch (error) {
        console.error("Failed to fetch fellowship voters:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [api, isLoadingVotes, allAye, allNay, minRank]);

  return {
    ...voters,
    isLoading: loading,
  };
}
