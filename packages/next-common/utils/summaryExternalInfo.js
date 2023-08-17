export function hasDefinedOffChainVoting() {
  return process.env.NEXT_PUBLIC_OFF_CHAIN_SPACE;
}

export function hasDefinedBounties() {
  return process.env.NEXT_PUBLIC_BOUNTIES_SITE_URL;
}
