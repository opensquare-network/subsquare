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

/**
 * The statescan REST api of a chain, e.g. https://ahp-api.statescan.io, which serves the lists
 * the GraphQL api has no query for. A dev can serve them from a locally running `server` instead,
 * e.g. NEXT_PUBLIC_STATESCAN_API_ENDPOINT=http://localhost:7101.
 */
export function getStatescanApiUrl(apiDomain) {
  const endpoint = process.env.NEXT_PUBLIC_STATESCAN_API_ENDPOINT;

  if (endpoint) {
    return endpoint.replace(/\/+$/, "");
  }

  if (!apiDomain) {
    return null;
  }

  return `https://${apiDomain}-api.statescan.io`;
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
