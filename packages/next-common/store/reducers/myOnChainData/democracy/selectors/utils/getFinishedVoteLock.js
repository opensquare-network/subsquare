export default function getFinishedVoteLock(
  vote,
  referendumInfo,
  latestHeight,
  lockingPeriod,
) {
  const { isSplit, aye, balance, conviction } = vote;
  const { approved, end } = referendumInfo.finished;

  if (isSplit) {
    return 0;
  }

  if (approved !== aye) {
    return 0;
  }

  const periodsArr = [0, 1, 2, 4, 8, 16, 32];
  const expiredAt = periodsArr[conviction] * lockingPeriod + end;
  return latestHeight >= expiredAt ? 0 : balance;
}
