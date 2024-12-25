import { useContextApi } from "next-common/context/api";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useOnchainData } from "next-common/context/post";
import { useEffect, useState } from "react";
import { isNil } from "lodash";
import { normalizeRankedCollectiveEntries } from "next-common/utils/rankedCollective/normalize";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import { getMinRankOfClass } from "next-common/context/post/fellowship/useMaxVoters";
import { useTrack } from "next-common/context/post/gov2/track";
import { useSelector } from "react-redux";
import {
  fellowshipVotesSelector,
  isLoadingFellowshipVotesSelector,
} from "next-common/store/reducers/fellowship/votes";

async function queryFellowshipCollectiveMembers(api, blockHeight) {
  let blockApi = api;
  if (blockHeight) {
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    blockApi = await api.at(blockHash);
  }
  const voters = await blockApi.query.fellowshipCollective.members.entries();
  return voters;
}

// Filter members by minimum rank
function filterMinRankedMembers(members = [], minRank) {
  return members.filter((member) => member?.rank >= minRank);
}

function groupVoters(members, allVotes) {
  const votedMembers = [];
  const unVotedMembers = [];

  members.forEach((member) => {
    const voter = Array.from(allVotes).find(
      (item) => item.address === member.address,
    );

    if (voter) {
      votedMembers.push({ ...member, isAye: voter?.isAye });
    } else {
      unVotedMembers.push(member);
    }
  });

  return { votedMembers, unVotedMembers };
}

export default function useCollectiveEligibleVoters() {
  const api = useContextApi();

  const [voters, setVoters] = useState({
    votedMembers: [],
    unVotedMembers: [],
  });
  const [loading, setLoading] = useState(true);

  const votingFinishHeight = useReferendumVotingFinishHeight();
  const { referendumIndex } = useOnchainData();

  const { id: trackId } = useTrack();
  const collectivePallet = useRankedCollectivePallet();
  const minRank = getMinRankOfClass(trackId, collectivePallet);

  const { allAye, allNay } = useSelector(fellowshipVotesSelector);
  const isLoadingVotes = useSelector(isLoadingFellowshipVotesSelector);

  useEffect(() => {
    if (!api || isNil(referendumIndex) || isLoadingVotes) {
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const voterEntries = await queryFellowshipCollectiveMembers(
          api,
          votingFinishHeight,
        );
        const data = normalizeRankedCollectiveEntries(voterEntries);

        // Filter members by minimum rank
        const minRankedMembers = filterMinRankedMembers(data, minRank);

        const allVotes = new Set([...allAye, ...allNay]);
        const groupedVoters = groupVoters(minRankedMembers, allVotes);

        setVoters(groupedVoters);
      } catch (error) {
        throw new Error("Failed to fetch fellowship voters:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    api,
    referendumIndex,
    votingFinishHeight,
    isLoadingVotes,
    allAye,
    allNay,
    minRank,
  ]);

  return {
    ...voters,
    isLoading: loading,
  };
}
