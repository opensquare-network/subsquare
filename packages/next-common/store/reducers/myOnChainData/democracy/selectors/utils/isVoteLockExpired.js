export default function isVoteLockExpired(
  vote,
  referendumInfo,
  latestHeight,
  lockingPeriod,
) {
  const { isSplit, aye, conviction } = vote;
  const { approved, end } = referendumInfo.finished;

  if (isSplit) {
    return true;
  }

  if (approved !== aye) {
    return true;
  }

  const periodsArr = [0, 1, 2, 4, 8, 16, 32];
  const expiredAt = periodsArr[conviction] * lockingPeriod + end;
  return latestHeight >= expiredAt;
}
