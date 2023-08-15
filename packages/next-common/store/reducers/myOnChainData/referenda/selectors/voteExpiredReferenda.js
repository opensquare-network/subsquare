import { createSelector } from "@reduxjs/toolkit";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { referendaLockingPeriodSelector } from "next-common/store/reducers/referenda/meta";
import flatten from "lodash.flatten";
import orderBy from "lodash.orderby";

function getVoteExpiredReferendaByTrack(voting, latestHeight, lockingPeriod) {
  const { isDelegating, votes = [] } = voting;
  if (isDelegating) {
    return [];
  }

  return votes.reduce((result, voteItem) => {
    const { vote, referendumInfo, referendumIndex, trackId } = voteItem;

    const item = { trackId, referendumIndex };
    if (!referendumInfo) {
      return [...result, item];
    } else if (referendumInfo.ongoing) {
      return result;
    }

    const { rejected, approved } = referendumInfo;
    if (!rejected && !approved) {
      return [...result, item];
    }

    const end = (approved || rejected)[0];
    const { isStandard, aye, conviction } = vote;
    if (!isStandard) {
      return [...result, item];
    }

    if ((approved && aye) || (rejected && !aye)) {
      const expiredAt = conviction * lockingPeriod + end;
      return latestHeight >= expiredAt ? [...result, item] : result;
    }

    return [...result, item];
  }, []);
}

export const voteExpiredReferendaSelector = createSelector(
  myReferendaVotingSelector,
  latestHeightSelector,
  referendaLockingPeriodSelector,
  (votingArr, latestHeight, lockingPeriod) => {
    const ordered = orderBy(votingArr, ["trackId"]);
    const referendaByTracks = ordered.map((voting) =>
      getVoteExpiredReferendaByTrack(voting, latestHeight, lockingPeriod),
    );
    return orderBy(flatten(referendaByTracks), ["referendumIndex"]);
  },
);
