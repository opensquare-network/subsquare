import { useCallback } from "react";
import { backendApi } from "next-common/services/nextApi";
import {
  extractSplitVotes,
  extractSplitAbstainVotes,
} from "next-common/utils/gov2/useVotesFromServer";

export function transformVotesData(rawVotes) {
  const allVotes = (rawVotes || []).reduce((result, vote) => {
    if (vote.isSplit) {
      return [...result, ...extractSplitVotes(vote)];
    } else if (vote.isSplitAbstain) {
      return [...result, ...extractSplitAbstainVotes(vote)];
    }
    return [...result, vote];
  }, []);

  const filteredVotes = allVotes.filter(
    (vote) =>
      BigInt(vote.votes) > 0 || BigInt(vote?.delegations?.votes || 0) > 0,
  );

  return filteredVotes;
}

export default function useReferendaVotesBackend(referendumIndex) {
  const fetchVotes = useCallback(async () => {
    try {
      const { result: rawVotes } = await backendApi.fetch(
        `gov2/referenda/${referendumIndex}/votes`,
      );

      return transformVotesData(rawVotes);
    } catch (err) {
      console.error(
        "Error fetching votes for referendum:",
        referendumIndex,
        err,
      );
      throw new Error("Error fetching votes for referendum");
    }
  }, [referendumIndex]);

  return {
    fetchVotes,
  };
}
