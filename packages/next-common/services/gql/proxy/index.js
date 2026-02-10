import { getProxiesClient } from "next-common/hooks/useAllGraphqlProxies";
import { isNil } from "lodash-es";
import { GET_PROXIES } from "next-common/services/gql/proxy/consts";

export async function queryProxies({ delegator = null, delegatee = null }) {
  const proxiesClient = getProxiesClient();
  if (!proxiesClient) {
    throw new Error("Proxies client is not supported");
  }

  let variables = {};
  if (!isNil(delegator)) {
    variables["delegator"] = delegator;
  }

  if (!isNil(delegatee)) {
    variables["delegatee"] = delegatee;
  }

  try {
    const { data } = await proxiesClient.query({
      query: GET_PROXIES,
      fetchPolicy: "no-cache",
      variables,
    });

    return data?.proxies;
  } catch {
    return null;
  }
}
