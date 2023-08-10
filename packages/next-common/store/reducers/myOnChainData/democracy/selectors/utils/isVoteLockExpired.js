export default function isVoteLockExpired(
  vote,
  referendumInfo,
  latestHeight,
  lockingPeriod,
) {
  const { isSplit, aye, conviction } = vote;
  const { approved, end } = referendumInfo;

  if (isSplit) {
    return true;
  }

  if (approved !== aye) {
    return true;
  }

  const expiredAt = conviction * lockingPeriod + end;
  return latestHeight >= expiredAt;
}
