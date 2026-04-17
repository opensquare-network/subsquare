// Refs to
// https://github.com/polkadot-fellows/runtimes/blob/main/system-parachains/collectives/collectives-polkadot/src/secretary/mod.rs#L82
export function getSecretaryMemberSalary(rank) {
  if (rank === 1) {
    return 6666000000;
  }

  return 0;
}
