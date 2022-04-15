import { ApiPromise, WsProvider } from "@polkadot/api";
import { khala } from "@phala/typedefs";
import { basilisk } from "./bundle/basilisk";
import interbtc from "./kintsugi/definitions";
import bifrostOptions from "./bifrost/options";
import karuraOptions from "./karura/options";
import polkadex from "./polkadex/definitions";
import crustOptions from "./crust/options";
import Chains from "../../utils/consts/chains";

const apiInstanceMap = new Map();

export default async function getApi(chain, endpoint) {
  if (!Object.keys(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${chain} to construct api`);
  }

  if (!apiInstanceMap.has(endpoint)) {
    const provider = new WsProvider(endpoint, 1000);
    let options = { provider };
    if (chain === "karura" || chain === "acala") {
      options = {
        ...karuraOptions,
        ...options,
      };
    } else if (chain === "khala") {
      options.types = khala;
    } else if (chain === "basilisk") {
      options.typesBundle = { spec: { basilisk } };
    } else if (chain === "bifrost") {
      options = {
        ...bifrostOptions,
        ...options,
      };
    } else if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      options = {
        ...options,
        typesBundle: {
          spec: {
            "interbtc-parachain": interbtc,
          },
        },
        rpc: interbtc.providerRpc,
      };
    } else if (chain === Chains.polkadex) {
      options = {
        ...options,
        typesBundle: { spec: { "node-polkadex": polkadex } },
      };
    } else if (chain === Chains.crust) {
      options = {
        ...crustOptions,
        ...options,
      };
    }

    const api = (await ApiPromise.create(options)).isReady;

    apiInstanceMap.set(endpoint, api);
  }
  return apiInstanceMap.get(endpoint);
}
