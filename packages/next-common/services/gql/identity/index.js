import { peopleIdentityClient } from "next-common/hooks/apollo";
import { defaultPageSize } from "next-common/utils/constants";
import { GET_IDENTITIES } from "./consts";

export async function queryPeopleIdentities(
  search = "",
  page = 1,
  pageSize = defaultPageSize,
) {
  const { data } =
    (await peopleIdentityClient?.query?.({
      query: GET_IDENTITIES,
      variables: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        search,
      },
    })) || {};

  return { data: data?.identities };
}
