import getChainSettings from "../consts/settings";

export function hasProxiesGraphQL() {
  const { subsquareGraphql } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  return subsquareGraphql?.intime?.proxy;
}
