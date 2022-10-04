export function isTreasuryMotion(motion = {}) {
  return motion.treasuryProposals?.length > 0 || motion?.treasuryBounties?.length > 0;
}

export function isDemocracyMotion(motion = {}) {
  return motion?.externalProposals?.length > 0;
}
