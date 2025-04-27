import { peopleIdentityClient } from "next-common/hooks/apollo";
import { defaultPageSize } from "next-common/utils/constants";
import {
  GET_IDENTITIES,
  GET_IDENTITIES_COUNT,
  GET_IDENTITIES_REGISTRARS,
} from "./consts";

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

export async function queryPeopleIdentitiesInfo(params = {}) {
  const { data } =
    (await peopleIdentityClient?.query?.({
      query: GET_IDENTITIES_COUNT,
      variables: {
        limit: 0,
        offset: 10,
        search: "",
        ...params,
      },
    })) || {};

  return { data: data?.identities };
}

export async function queryPeopleRegistrarsFromApi() {
  const { data } =
    (await peopleIdentityClient?.query?.({
      query: GET_IDENTITIES_REGISTRARS,
    })) || {};

  return { data: data?.identityRegistrars };
}
