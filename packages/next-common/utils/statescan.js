import getChainSettings from "./consts/settings";

export function getStatescanDomain(chain) {
  const { integrations } = getChainSettings(chain);

  if (!integrations?.statescan) {
    return null;
  }

  const domain = integrations.statescan.domain || chain;

  return domain;
}

/**
 * The statescan GraphQL api of a chain, e.g. https://ahp-gh-api.statescan.io/graphql, which
 * every statescan query of the app reads. A dev can serve them from a locally running
 * graphql-server instead, e.g. NEXT_PUBLIC_STATESCAN_GRAPHQL_ENDPOINT=http://localhost:7100/graphql.
 */
export function getStatescanGraphqlUrl(subDomain) {
  const endpoint = process.env.NEXT_PUBLIC_STATESCAN_GRAPHQL_ENDPOINT;

  if (endpoint) {
    return endpoint;
  }

  if (!subDomain) {
    return null;
  }

  return `https://${subDomain}.statescan.io/graphql`;
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
