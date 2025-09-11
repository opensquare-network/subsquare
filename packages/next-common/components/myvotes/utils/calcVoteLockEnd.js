export default function calcVoteLockEnd(
  referendumVoteEnd,
  lockPeriod,
  conviction,
) {
  const periodsArr = [0, 1, 2, 4, 8, 16, 32];
  return referendumVoteEnd + periodsArr[conviction] * lockPeriod;
}
