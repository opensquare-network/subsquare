export function hasDefinedOffChainVoting() {
  return (
    process.env.NEXT_PUBLIC_VOTING_SITE_URL &&
    process.env.NEXT_PUBLIC_VOTING_SPACE_NAME
  );
}

export function hasDefinedBounties() {
  return (
    process.env.NEXT_PUBLIC_BOUNTIES_API_URL &&
    process.env.NEXT_PUBLIC_BOUNTIES_SITE_URL
  );
}
