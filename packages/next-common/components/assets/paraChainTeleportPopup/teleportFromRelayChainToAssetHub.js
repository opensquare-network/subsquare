import Chains from "next-common/utils/consts/chains";

export const AssetHubParaId = 1000;
export const CollectivesParaId = 1001;

export function getParaChainId(chain) {
  if (chain === Chains.polkadotAssetHub) {
    return AssetHubParaId;
  } else if (chain === Chains.collectives) {
    return CollectivesParaId;
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
      V3: {
        interior: {
          X1: {
            ParaChain: paraChainId,
          },
        },
        parents: 0,
      },
    },
    {
      V3: {
        interior: {
          X1: {
            AccountId32: {
              id: api.createType("AccountId32", transferToAddress).toHex(),
              network: null,
            },
          },
        },
        parents: 0,
      },
    },
    {
      V3: [
        {
          fun: {
            Fungible: amount,
          },
          id: {
            Concrete: {
              interior: "Here",
              parents: 0,
            },
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
