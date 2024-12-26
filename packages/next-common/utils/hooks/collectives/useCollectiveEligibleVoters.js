import { useContextApi } from "next-common/context/api";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useEffect, useState } from "react";
import { groupBy, orderBy } from "lodash-es";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { useSelector } from "react-redux";
import {
  fellowshipVotesSelector,
  isLoadingFellowshipVotesSelector,
} from "next-common/store/reducers/fellowship/votes";
import useRankedCollectiveMinRank from "next-common/hooks/collectives/useRankedCollectiveMinRank";

async function queryFellowshipCollectiveMembers(api, blockHash) {
  let blockApi = api;
  if (blockHash) {
    blockApi = await api.at(blockHash);
  }
  return await blockApi.query.fellowshipCollective.members.entries();
}

function getMemberVotes(rank, minRank) {
  if (rank < minRank) {
    throw new Error(`Rank ${rank} is too low, and minimum rank is ${minRank}`);
  }
  const excess = rank - minRank;
  const v = excess + 1;
  return Math.floor((v * (v + 1)) / 2);
}

export default function useCollectiveEligibleVoters() {
  const api = useContextApi();

  const [voters, setVoters] = useState({
    votedMembers: [],
    unVotedMembers: [],
  });
  const [loading, setLoading] = useState(true);

  const votingFinishIndexer = useReferendumVotingFinishIndexer();
  const minRank = useRankedCollectiveMinRank();

  const { allAye, allNay } = useSelector(fellowshipVotesSelector);
  const isLoadingVotes = useSelector(isLoadingFellowshipVotesSelector);

  useEffect(() => {
    if (!api || isLoadingVotes) {
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const memberEntries = await queryFellowshipCollectiveMembers(
          api,
          votingFinishIndexer?.blockHash,
        );
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

        const votedVotersSet = new Set(
          [...allAye, ...allNay].map((item) => item.address),
        );
        const { true: votedMembers, false: unVotedMembers } = groupBy(
          votersWithPower,
          (member) => votedVotersSet.has(member.address),
        );

        setVoters({
          votedMembers: votedMembers.map((m) => ({ ...m, isAye: true })),
          unVotedMembers: unVotedMembers.map((m) => ({ ...m, isAye: false })),
        });
      } catch (error) {
        console.error("Failed to fetch fellowship voters:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [api, votingFinishIndexer, isLoadingVotes, allAye, allNay, minRank]);

  return {
    ...voters,
    isLoading: loading,
  };
}
