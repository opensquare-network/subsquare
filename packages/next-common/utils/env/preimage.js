import getChainSettings from "../consts/settings";

export function hasPreimagesGraphQL() {
  const { preimagesGraphql } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  return preimagesGraphql;
}
