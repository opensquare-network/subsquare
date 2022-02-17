import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from "@acala-network/type-definitions";
import { khala } from "@phala/typedefs";
import { basilisk } from "./bundle/basilisk";
import {
  typesBundleForPolkadot as bifrostTypesBundleForPolkadot,
  rpc as bifrostRpc,
} from "@bifrost-finance/type-definitions";
import { Chains } from "../../utils/constants";
import interbtc from "./kintsugi/definitions";

const apiInstanceMap = new Map();

export default async function getApi(chain, endpoint) {
  if (!Object.keys(Chains).includes(chain)) {
    throw new Error(`Invalid chain: ${chain} to construct api`);
  }

  if (!apiInstanceMap.has(endpoint)) {
    const provider = new WsProvider(endpoint, 1000);
    let options = { provider };
    if (chain === "karura" || chain === "acala") {
      options.typesBundle = { ...typesBundleForPolkadot };
    }
    if (chain === "khala") {
      options.types = khala;
    }
    if (chain === "basilisk") {
      options.typesBundle = { spec: { basilisk } };
    } else if (chain === "bifrost") {
      options.typesBundle = {
        spec: {
          bifrost: bifrostTypesBundleForPolkadot.spec.bifrost,
          "bifrost-parachain": bifrostTypesBundleForPolkadot.spec.bifrost,
        },
      };
      options.rpc = bifrostRpc;
    } else if (chain === Chains.kintsugi) {
      options = {
        ...options,
        typesBundle: {
          spec: {
            "interbtc-parachain": interbtc,
          },
        },
        rpc: interbtc.providerRpc,
      };
    }

    apiInstanceMap.set(endpoint, ApiPromise.create(options));
  }
  return apiInstanceMap.get(endpoint);
}
