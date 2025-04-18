import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import {
  useRankedCollectivePallet,
  useReferendaFellowshipPallet,
} from "next-common/context/collectives/collectives";
import { useCallback, useEffect, useState } from "react";
import useMyRank from "./memberPromotionPopup/voteButtons/useMyRank";
import {
  getTrackToPromoteToRank,
  getMinRankOfClass,
  getTrackToRetainAtRank,
} from "next-common/context/post/fellowship/useMaxVoters";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMyVotesChangedContext } from "../context/myVotesChanged";

export function useRetainAndVoteTaskCount(items) {
  const api = useContextApi();
  const myRank = useMyRank();
  const collectivePallet = useRankedCollectivePallet();
  const [count, setCount] = useState(0);
  const { myVotesChangeTimes } = useMyVotesChangedContext();

  const calculateCount = useCallback(async () => {
    if (myRank < 3) {
      return 0;
    }

    const addresses = [];
    for (const item of items) {
      if (isNil(item.referendumIndex)) {
        addresses.push(item.who);
      }
    }
    const members = await api.query[collectivePallet].members.multi(addresses);

    let count = 0;

    for (const member of members) {
      const rank = member.unwrap()?.rank?.toNumber();
      if (isNil(rank) || rank === 0) {
        continue;
      }
      const trackId = getTrackToRetainAtRank(rank);
      const requiredRank = getMinRankOfClass(trackId, collectivePallet);
      if (requiredRank > myRank) {
        continue;
      }
      count++;
    }

    return count;
  }, [api, collectivePallet, items, myRank]);

  useEffect(() => {
    if (!api) {
      return;
    }
    calculateCount().then((count) => {
      setCount(count);
    });
  }, [calculateCount, api, myVotesChangeTimes]);

  return count;
}

export function usePromoteAndVoteTaskCount(items) {
  const api = useContextApi();
  const myRank = useMyRank();
  const collectivePallet = useRankedCollectivePallet();
  const [count, setCount] = useState(0);
  const { myVotesChangeTimes } = useMyVotesChangedContext();

  const calculateCount = useCallback(async () => {
    if (myRank < 3) {
      return 0;
    }

    const addresses = [];
    for (const item of items) {
      if (isNil(item.referendumIndex)) {
        addresses.push(item.who);
      }
    }
    const members = await api.query[collectivePallet].members.multi(addresses);

    let count = 0;

    for (const member of members) {
      const rank = member.unwrap()?.rank?.toNumber();
      if (isNil(rank)) {
        continue;
      }
      const trackId = getTrackToPromoteToRank(rank + 1);
      const requiredRank = getMinRankOfClass(trackId, collectivePallet);
      if (requiredRank > myRank) {
        continue;
      }
      count++;
    }

    return count;
  }, [api, collectivePallet, items, myRank]);

  useEffect(() => {
    if (!api) {
      return;
    }
    calculateCount().then((count) => {
      setCount(count);
    });
  }, [calculateCount, api, myVotesChangeTimes]);

  return count;
}

export function useVoteTaskCount(items) {
  const address = useRealAddress();
  const api = useContextApi();
  const myRank = useMyRank();
  const referendaPallet = useReferendaFellowshipPallet();
  const collectivePallet = useRankedCollectivePallet();
  const [count, setCount] = useState(0);
  const { myVotesChangeTimes } = useMyVotesChangedContext();

  const calculateCount = useCallback(async () => {
    const referendumIndexes = [];
    for (const item of items) {
      if (!isNil(item.referendumIndex)) {
        referendumIndexes.push(item.referendumIndex);
      }
    }

    const referendums = await api.query[
      referendaPallet
    ].referendumInfoFor.multi(referendumIndexes);

    const myVotes = await api.query[collectivePallet].voting.multi(
      referendumIndexes.map((referendumIndex) => [referendumIndex, address]),
    );

    let count = 0;

    for (let i = 0; i < referendumIndexes.length; i++) {
      const myVote = myVotes[i];

      // Skip referendums already voted
      if (myVote?.isSome) {
        continue;
      }

      const referendum = referendums[i];
      const track = referendum?.unwrap()?.asOngoing?.track;
      if (isNil(track)) {
        continue;
      }
      const requiredRank = getMinRankOfClass(track, collectivePallet);
      if (requiredRank > myRank) {
        continue;
      }
      count++;
    }

    return count;
  }, [api, referendaPallet, collectivePallet, items, address, myRank]);

  useEffect(() => {
    if (!api) {
      return;
    }
    calculateCount().then((count) => {
      setCount(count);
    });
  }, [calculateCount, api, myVotesChangeTimes]);

  return count;
}

export function useMyPromotionTaskCount(items) {
  const voteCount = useVoteTaskCount(items);
  const promoteAndVoteCount = usePromoteAndVoteTaskCount(items);
  return voteCount + promoteAndVoteCount;
}

export function useMyRetentionTaskCount(items) {
  const voteCount = useVoteTaskCount(items);
  const retainAndVoteCount = useRetainAndVoteTaskCount(items);
  return voteCount + retainAndVoteCount;
}
