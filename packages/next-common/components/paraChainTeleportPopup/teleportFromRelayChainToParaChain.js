import {
  isAssetHubChain,
  isPeopleChain,
  isCoretimeChain,
} from "next-common/utils/chain";
import Chains from "next-common/utils/consts/chains";

export const AssetHubParaId = 1000;
export const CollectivesParaId = 1001;
export const PeopleParaId = 1004;
export const CoretimeParaId = 1005;

export function getParaChainId(chain) {
  if (isAssetHubChain(chain)) {
    return AssetHubParaId;
  } else if (chain === Chains.collectives) {
    return CollectivesParaId;
  } else if (isPeopleChain(chain)) {
    return PeopleParaId;
  } else if (isCoretimeChain(chain)) {
    return CoretimeParaId;
  }
  throw new Error("Unsupported para chain");
}

function getTeleportParamsFromRelayChainToParaChain({
  api,
  transferToAddress,
  amount,
  paraChainId,
}) {
  return [
    {
      V4: {
        parents: 0,
        interior: {
          X1: [
            {
              ParaChain: paraChainId,
            },
          ],
        },
      },
    },
    {
      V4: {
        parents: 0,
        interior: {
          X1: [
            {
              AccountId32: {
                id: api.createType("AccountId32", transferToAddress).toHex(),
                network: null,
              },
            },
          ],
        },
      },
    },
    {
      V4: [
        {
          id: {
            parents: 0,
            interior: "Here",
          },
          fun: {
            Fungible: amount,
          },
        },
      ],
    },
    0,
    { Unlimited: null },
  ];
}

export default function teleportFromRelayChainToParaChain({
  sourceApi,
  transferToAddress,
  amount,
  paraChainId,
}) {
  const params = getTeleportParamsFromRelayChainToParaChain({
    api: sourceApi,
    transferToAddress,
    amount,
    paraChainId,
  });
  return sourceApi.tx.xcmPallet.limitedTeleportAssets(...params);
}
