import { backendApi } from "next-common/services/nextApi";
import getMultisigApiUrl from "./url";
import getMultisigsQuery, {
  getMultisigsCountQuery,
  getMultisigAddressesQuery,
} from "./query";

export default async function fetchMultisigs(
  chain,
  address,
  page = 1,
  pageSize = 15,
) {
  // todo: use @apollo/client to query graphql data
  return await backendApi.fetch(
    getMultisigApiUrl(chain),
    {},
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extensions: {},
        operationName: "MyQuery",
        query: getMultisigsQuery(address, page, pageSize),
      }),
    },
  );
}

export async function fetchMultisigsCount(chain, address) {
  return await backendApi.fetch(
    getMultisigApiUrl(chain),
    {},
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extensions: {},
        operationName: "MyQuery",
        query: getMultisigsCountQuery(address),
      }),
    },
  );
}

export async function fetchMultisigAddresses(
  chain,
  address,
  page = 1,
  pageSize = 10,
) {
  return await backendApi.fetch(
    getMultisigApiUrl(chain),
    {},
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extensions: {},
        operationName: "MyQuery",
        query: getMultisigAddressesQuery(address, page, pageSize),
      }),
    },
  );
}
