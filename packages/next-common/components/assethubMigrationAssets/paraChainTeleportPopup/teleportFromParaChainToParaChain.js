function getTeleportParamsFromParaChainToParaChain({
  api,
  transferToAddress,
  amount,
  paraChainId,
}) {
  return [
    {
      V4: {
        parents: 1,
        interior: {
          X1: [
            {
              Parachain: paraChainId,
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
                network: null,
                id: api.createType("AccountId32", transferToAddress).toHex(),
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
            parents: 1,
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

export default function teleportFromParaChainToParaChain({
  sourceApi,
  transferToAddress,
  amount,
  paraChainId,
}) {
  const params = getTeleportParamsFromParaChainToParaChain({
    api: sourceApi,
    transferToAddress,
    amount,
    paraChainId,
  });
  return sourceApi.tx.polkadotXcm.limitedTeleportAssets(...params);
}
