function getTeleportParamsFromParaChainToRelayChain({
  api,
  transferToAddress,
  amount,
}) {
  return [
    {
      V3: {
        parents: 1,
        interior: "Here",
      },
    },
    {
      V3: {
        parents: 0,
        interior: {
          X1: {
            AccountId32: {
              id: api.createType("AccountId32", transferToAddress).toHex(),
              network: null,
            },
          },
        },
      },
    },
    {
      V3: [
        {
          id: {
            Concrete: {
              parents: 1,
              interior: "Here",
            },
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

export default function teleportFromParaChainToRelayChain({
  sourceApi,
  transferToAddress,
  amount,
}) {
  const params = getTeleportParamsFromParaChainToRelayChain({
    api: sourceApi,
    transferToAddress,
    amount,
  });
  return sourceApi.tx.polkadotXcm.limitedTeleportAssets(...params);
}
