import getVoteEndInfo from "../vote/utils/getVoteEndInfo";

export default function getVoteExpiredReferenda(
  votes = [],
  period,
  isReferenda,
  latestHeight,
) {
  return votes.reduce((result, vote) => {
    const itemLock = getVoteEndInfo(vote, period, isReferenda);
    const { hasLock, lockEnd } = itemLock;

    if (!hasLock || latestHeight >= lockEnd) {
      return [
        ...result,
        {
          referendumIndex: vote.referendumIndex,
          ...(isReferenda ? { trackId: vote.trackId } : {}),
        },
      ];
    }

    return result;
  }, []);
}
