import getChainSettings from "./consts/settings";

export function getStatescanDomain(chain) {
  const { integrations } = getChainSettings(chain);

  if (!integrations?.statescan) {
    return null;
  }

  const domain = integrations.statescan.domain || chain;

  return domain;
}

export function getStatescanApiDomain(chain) {
  const { integrations } = getChainSettings(chain);

  if (!integrations?.statescan) {
    return null;
  }

  const apiDomain =
    integrations.statescan.apiDomain || integrations.statescan.domain || chain;

  return apiDomain;
}
