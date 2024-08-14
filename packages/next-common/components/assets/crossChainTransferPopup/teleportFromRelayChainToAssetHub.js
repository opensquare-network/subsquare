const AssetHubParaId = 1000;

function getTeleportParamsFromRelayChainToAssetHub({
  api,
  transferToAddress,
  amount,
}) {
  return [
    {
      V3: {
        interior: {
          X1: {
            ParaChain: AssetHubParaId,
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

export default function teleportFromRelayChainToAssetHub({
  sourceApi,
  transferToAddress,
  amount,
}) {
  const params = getTeleportParamsFromRelayChainToAssetHub({
    api: sourceApi,
    transferToAddress,
    amount,
  });
  return sourceApi.tx.xcmPallet.limitedTeleportAssets(...params);
}
