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
    const periodsArr = [0, 1, 2, 4, 8, 16, 32];
    const expiredAt = periodsArr[conviction] * lockingPeriod + end;
    return latestHeight >= expiredAt ? 0 : balance;
  }

  return 0;
}
