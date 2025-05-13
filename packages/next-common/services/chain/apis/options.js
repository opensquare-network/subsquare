import Chains from "next-common/utils/consts/chains";
import crabOptions from "next-common/services/chain/crab";
import getMetadata from "next-common/services/chain/apis/metadata";
import getApiProvider from "next-common/services/chain/apis/providers";

async function getOptions(chain, endpoint) {
  const provider = getApiProvider(endpoint);
  let options = { provider };

  const allOptions = (await import("@osn/provider-options")).default;

  let customizedOptions;
  if ([Chains.karura, Chains.acala].includes(chain)) {
    customizedOptions = allOptions.karuraOptions;
  } else if ([Chains.khala, Chains.phala].includes(chain)) {
    customizedOptions = allOptions.khalaOptions;
  } else if (chain === Chains.bifrost) {
    customizedOptions = allOptions.bifrostOptions;
  } else if (chain === Chains.polkadex) {
    customizedOptions = allOptions.polkadexOptions;
  } else if (chain === Chains.crust) {
    customizedOptions = allOptions.crustOptions;
  } else if (chain === Chains.crab) {
    customizedOptions = crabOptions;
  } else if (chain === Chains.zeitgeist) {
    customizedOptions = allOptions.zeitgeistOptions;
  } else if (chain === Chains.altair) {
    customizedOptions = allOptions.altairOptions;
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
