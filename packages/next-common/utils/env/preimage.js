import getChainSettings from "../consts/settings";

export function hasPreimagesGraphQL() {
  const { subsquareGraphql } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  return subsquareGraphql?.intime?.preimage;
}
