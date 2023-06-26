export function getIdentityDisplay(identity) {
  return identity?.info?.displayParent
    ? `${identity?.info?.displayParent}/${identity?.info?.display}`
    : identity?.info?.display;
}
