import Chains from "next-common/utils/consts/chains";
import getMetadata from "next-common/services/chain/apis/metadata";
import getApiProvider from "next-common/services/chain/apis/providers";

async function getOptions(chain, endpoint) {
  const provider = await getApiProvider(endpoint);
  let options = { provider };

  const allOptions = (await import("@osn/provider-options")).default;

  let customizedOptions;
  if ([Chains.karura, Chains.acala].includes(chain)) {
    customizedOptions = allOptions.karuraOptions;
  } else if ([Chains.khala, Chains.phala].includes(chain)) {
    customizedOptions = allOptions.khalaOptions;
  } else {
    customizedOptions = allOptions[chain] || {};
  }

  const { id, metadata } = await getMetadata(provider);
  return {
    ...customizedOptions,
    ...options,
    metadata: { [id]: metadata },
  };
}

export default getOptions;
