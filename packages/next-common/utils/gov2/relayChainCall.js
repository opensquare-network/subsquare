import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";
import { getRelayChain } from "next-common/utils/chain";
import { getOriginApi } from "next-common/services/chain/api";
const apiMap = new Map();

export async function extractXcmContext(data) {
  if (!data || data.section !== "polkadotXcm") {
    return null;
  }

  const dest = data.args[0]?.value;
  const message = data.args[1]?.value;
  const destChainId = parseDestChainId(dest);

  const encodedCalls = [];
  if (message.v4 && Array.isArray(message.v4)) {
    message.v4.forEach((instruction) => {
      if (instruction.transact?.call?.encoded) {
        encodedCalls.push(instruction.transact.call.encoded);
      }
    });
  }

  return [
    {
      destChainId,
      encodedCalls,
    },
  ];
}

function parseDestChainId(dest) {
  if (!dest.v4) return null;
  const { parents, interior } = dest.v4;

  if (parents === 1 && interior.here === null) {
    return "0";
  }
  if (parents === 1 && interior.X1?.Parachain) {
    return interior.X1.Parachain.toString();
  }
  if (parents === 1 && interior.X2?.[0]?.Parachain) {
    return interior.X2[0].Parachain.toString();
  }
  return null;
}

export function getDestApi(destChainId) {
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

export function clearDestApi() {
  apiMap.forEach(async (api) => {
    (await api)?.disconnect();
  });
  apiMap.clear();
}
