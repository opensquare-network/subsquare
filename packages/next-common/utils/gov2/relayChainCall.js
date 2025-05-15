import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";
import { getRelayChain } from "next-common/utils/chain";
import { getOriginApi } from "next-common/services/chain/api";
import { isObject } from "lodash-es";

const apiMap = new Map();

export function extractXcmContext(data) {
  if (!data || !Array.isArray(data?.args)) {
    return null;
  }

  const destArg = data.args.find((arg) => arg.name === "dest");
  const msgArg = data.args.find((arg) => arg.name === "message");

  if (!destArg || !msgArg) {
    for (const arg of data.args) {
      const result = extractXcmContext(arg?.value);
      if (result) {
        return result;
      }
    }
    return null;
  }

  const xcmLocation = parseXcmLocation(destArg?.value);
  if (!xcmLocation) {
    return null;
  }

  return {
    xcmLocation,
    encodeds: findAllEncoded(msgArg?.value),
  };
}

function parseXcmLocation(dest) {
  if (!dest.v4) return null;
  const { parents, interior } = dest.v4;

  if (parents === 1 && interior.here === null) {
    return "0";
  }
  return null;
}

function findAllEncoded(message) {
  const result = [];

  function recurse(item) {
    if (!isObject(item)) {
      return null;
    }

    if (typeof item.encoded === "string" && item.encoded.startsWith("0x")) {
      result.push(item.encoded);
    }

    for (const value of Object.values(item)) {
      recurse(value);
    }
  }

  recurse(message);
  return result;
}

export function getXcmLocationApi(destChainId) {
  const chainMap = {
    0: getRelayChain(CHAIN),
  };
  const chain = chainMap[destChainId];
  if (!chain) {
    return null;
  }
  const { endpoints } = getChainSettings(chain);
  const endpoint = endpoints[0]?.url;

  if (!apiMap.get(endpoint)) {
    apiMap.set(endpoint, getOriginApi(chain, endpoint));
  }

  return apiMap.get(endpoint);
}

export function clearXcmLocationApi() {
  apiMap.forEach(async (api) => {
    (await api)?.disconnect();
  });
  apiMap.clear();
}
