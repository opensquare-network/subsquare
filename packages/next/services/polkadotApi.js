import { ApiPromise, WsProvider } from "@polkadot/api";
import { typesBundleForPolkadot } from "@acala-network/type-definitions";
import { khala } from "@phala/typedefs";
import { basilisk } from "./bundle/basilisk";
import {
  typesBundleForPolkadot as bifrostTypesBundleForPolkadot,
  rpc,
} from "@bifrost-finance/type-definitions";

const apiInstanceMap = new Map();

export const getApi = async (chain, queryUrl) => {
  if (!apiInstanceMap.has(queryUrl)) {
    const provider = new WsProvider(queryUrl, 1000);
    const options = { provider };
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
        rpc,
      };
    }

    apiInstanceMap.set(queryUrl, ApiPromise.create(options));
  }
  return apiInstanceMap.get(queryUrl);
};
