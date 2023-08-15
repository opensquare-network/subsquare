export default function getFinishedVoteLock(
  vote,
  referendumInfo,
  latestHeight,
  lockingPeriod,
) {
  const { rejected, approved } = referendumInfo;
  if (!rejected && !approved) {
    return 0;
  }

  const end = (approved || rejected)[0];
  const { isStandard, aye, balance, conviction } = vote;
  if (!isStandard) {
    return 0;
  }

  if ((approved && aye) || (rejected && !aye)) {
    const expiredAt = conviction * lockingPeriod + end;
    return latestHeight >= expiredAt ? 0 : balance;
  }

  return 0;
}
