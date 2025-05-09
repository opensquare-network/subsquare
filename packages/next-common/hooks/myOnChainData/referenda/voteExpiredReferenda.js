import { useSelector } from "react-redux";
import { myReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { referendaLockingPeriodSelector } from "next-common/store/reducers/referenda/meta";
import { flatten } from "lodash-es";
import { orderBy } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";

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
      const periodsArr = [0, 1, 2, 4, 8, 16, 32];
      const expiredAt = periodsArr[conviction] * lockingPeriod + end;
      return latestHeight >= expiredAt ? [...result, item] : result;
    }

    return [...result, item];
  }, []);
}

export function useVoteExpiredReferenda() {
  const votingArr = useSelector(myReferendaVotingSelector);
  const latestHeight = useChainOrScanHeight();
  const lockingPeriod = useSelector(referendaLockingPeriodSelector);

  const ordered = orderBy(votingArr, ["trackId"]);
  const referendaByTracks = ordered.map((voting) =>
    getVoteExpiredReferendaByTrack(voting, latestHeight, lockingPeriod),
  );
  return orderBy(flatten(referendaByTracks), ["referendumIndex"]);
}
