import { proxyClient } from "next-common/hooks/apollo";
import { GET_PROXIES } from "./consts";
import { defaultPageSize } from "next-common/utils/constants";

export async function queryProxies(
  { delegatee, delegator, isActive, isPure },
  page = 1,
  pageSize = defaultPageSize,
) {
  const { data } =
    (await proxyClient?.query?.({
      query: GET_PROXIES,
      variables: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        delegatee,
        delegator,
        isActive,
        isPure,
      },
    })) || {};

  return { data: data?.proxies };
}
