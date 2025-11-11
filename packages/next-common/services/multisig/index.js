import { backendApi } from "next-common/services/nextApi";
import getMultisigApiUrl, { getRelayChainMultisigApiUrl } from "./url";
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
  apiUrl,
  address,
  page = 1,
  pageSize = 10,
) {
  return await backendApi.fetch(
    apiUrl,
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

export async function fetchMergedMultisigAddresses(chain, address) {
  const relayChainApiUrl = getRelayChainMultisigApiUrl(chain);
  const assethubApiUrl = getMultisigApiUrl(chain);

  const [relayResult, assethubResult] = await Promise.all([
    relayChainApiUrl
      ? fetchMultisigAddresses(relayChainApiUrl, address, 1, 100)
      : Promise.resolve({ result: null }),
    fetchMultisigAddresses(assethubApiUrl, address, 1, 100),
  ]);

  const relayChainAddresses =
    relayResult?.result?.data?.multisigAddresses?.multisigAddresses || [];
  const assethubAddresses =
    assethubResult?.result?.data?.multisigAddresses?.multisigAddresses || [];

  const addressMap = new Map();
  assethubAddresses?.forEach((item) => {
    addressMap.set(item.address, item);
  });

  relayChainAddresses?.forEach((item) => {
    if (addressMap.has(item.address)) {
      return;
    }

    addressMap.set(item.address, item);
  });

  const allMergedAddresses = Array.from(addressMap.values());

  return {
    result: {
      data: {
        multisigAddresses: {
          multisigAddresses: allMergedAddresses,
          total: allMergedAddresses.length,
        },
      },
    },
  };
}
