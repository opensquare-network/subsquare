export default function getFinishedVoteLock(
  vote,
  referendumInfo,
  latestHeight,
  lockingPeriod,
) {
  const { isSplit, aye, balance, conviction } = vote;
  const { approved, end } = referendumInfo;

  if (isSplit) {
    return 0;
  }

  if (approved !== aye) {
    return 0;
  }

  const expiredAt = conviction * lockingPeriod + end;
  return latestHeight >= expiredAt ? 0 : balance;
}
