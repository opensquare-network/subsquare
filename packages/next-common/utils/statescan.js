import getChainSettings from "./consts/settings";

export function getStatescanDomain(chain) {
  const { integrations } = getChainSettings(chain);

  if (!integrations?.statescan) {
    return null;
  }

  const domain = integrations.statescan.domain || chain;

  return domain;
}
