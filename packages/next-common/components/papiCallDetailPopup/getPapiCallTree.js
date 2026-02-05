export function getPapiCallTree() {
  return {
    type: "Call",
    section: "utility",
    method: "batchAll",
    children: [
      {
        type: "Vec<Call>",
        name: "calls",
        rawType: "sequence",
        children: [
          {
            type: "Call",
            section: "treasury",
            method: "spend",
            children: [
              {
                type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                name: "assetKind",
                rawType: "enum",
                children: [
                  {
                    type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                    name: "v5",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV5Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV5Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV5AssetAssetId",
                        name: "assetId",
                        rawType: "struct",
                        children: [
                          {
                            type: "StagingXcmV5Location",
                            name: "value",
                            rawType: "struct",
                            children: [
                              {
                                type: "u8",
                                name: "parents",
                                rawType: "primitive",
                                value: 0,
                              },
                              {
                                type: "StagingXcmV5Junctions",
                                name: "interior",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "[StagingXcmV5Junction; 2]",
                                    name: "x2",
                                    rawType: "array",
                                    children: [
                                      {
                                        type: "u8",
                                        name: "palletInstance",
                                        rawType: "primitive",
                                        value: 50,
                                      },
                                      {
                                        type: "Compact<u128>",
                                        name: "generalIndex",
                                        rawType: "compact",
                                        value: "1337",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "Compact<u128>",
                name: "amount",
                rawType: "compact",
                value: "26600000000",
              },
              {
                type: "ParachainsCommonPayVersionedLocatableAccount",
                name: "beneficiary",
                rawType: "enum",
                children: [
                  {
                    type: "ParachainsCommonPayVersionedLocatableAccount",
                    name: "v4",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV4Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV4Location",
                        name: "accountId",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                            children: [
                              {
                                type: "StagingXcmV4Junction",
                                name: "x1",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "StagingXcmV4Junction",
                                    name: "accountId32",
                                    rawType: "struct",
                                    children: [
                                      {
                                        type: "Option<StagingXcmV4JunctionNetworkId>",
                                        name: "network",
                                        rawType: "option",
                                        value: null,
                                      },
                                      {
                                        type: "H256",
                                        name: "id",
                                        rawType: "array",
                                        value:
                                          "0x54a64ecca7929558dae7c2207a1d8b4128fc8654a7df908d474376c1ca7a3479",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              null,
            ],
          },
          {
            type: "Call",
            section: "treasury",
            method: "spend",
            children: [
              {
                type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                name: "assetKind",
                rawType: "enum",
                children: [
                  {
                    type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                    name: "v5",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV5Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV5Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV5AssetAssetId",
                        name: "assetId",
                        rawType: "struct",
                        children: [
                          {
                            type: "StagingXcmV5Location",
                            name: "value",
                            rawType: "struct",
                            children: [
                              {
                                type: "u8",
                                name: "parents",
                                rawType: "primitive",
                                value: 0,
                              },
                              {
                                type: "StagingXcmV5Junctions",
                                name: "interior",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "[StagingXcmV5Junction; 2]",
                                    name: "x2",
                                    rawType: "array",
                                    children: [
                                      {
                                        type: "u8",
                                        name: "palletInstance",
                                        rawType: "primitive",
                                        value: 50,
                                      },
                                      {
                                        type: "Compact<u128>",
                                        name: "generalIndex",
                                        rawType: "compact",
                                        value: "1337",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "Compact<u128>",
                name: "amount",
                rawType: "compact",
                value: "11400000000",
              },
              {
                type: "ParachainsCommonPayVersionedLocatableAccount",
                name: "beneficiary",
                rawType: "enum",
                children: [
                  {
                    type: "ParachainsCommonPayVersionedLocatableAccount",
                    name: "v4",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV4Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV4Location",
                        name: "accountId",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                            children: [
                              {
                                type: "StagingXcmV4Junction",
                                name: "x1",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "StagingXcmV4Junction",
                                    name: "accountId32",
                                    rawType: "struct",
                                    children: [
                                      {
                                        type: "Option<StagingXcmV4JunctionNetworkId>",
                                        name: "network",
                                        rawType: "option",
                                        value: null,
                                      },
                                      {
                                        type: "H256",
                                        name: "id",
                                        rawType: "array",
                                        value:
                                          "0x54a64ecca7929558dae7c2207a1d8b4128fc8654a7df908d474376c1ca7a3479",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              null,
            ],
          },
          {
            type: "Call",
            section: "treasury",
            method: "spend",
            children: [
              {
                type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                name: "assetKind",
                rawType: "enum",
                children: [
                  {
                    type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                    name: "v5",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV5Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV5Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV5AssetAssetId",
                        name: "assetId",
                        rawType: "struct",
                        children: [
                          {
                            type: "StagingXcmV5Location",
                            name: "value",
                            rawType: "struct",
                            children: [
                              {
                                type: "u8",
                                name: "parents",
                                rawType: "primitive",
                                value: 0,
                              },
                              {
                                type: "StagingXcmV5Junctions",
                                name: "interior",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "[StagingXcmV5Junction; 2]",
                                    name: "x2",
                                    rawType: "array",
                                    children: [
                                      {
                                        type: "u8",
                                        name: "palletInstance",
                                        rawType: "primitive",
                                        value: 50,
                                      },
                                      {
                                        type: "Compact<u128>",
                                        name: "generalIndex",
                                        rawType: "compact",
                                        value: "1337",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "Compact<u128>",
                name: "amount",
                rawType: "compact",
                value: "11400000000",
              },
              {
                type: "ParachainsCommonPayVersionedLocatableAccount",
                name: "beneficiary",
                rawType: "enum",
                children: [
                  {
                    type: "ParachainsCommonPayVersionedLocatableAccount",
                    name: "v4",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV4Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV4Location",
                        name: "accountId",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                            children: [
                              {
                                type: "StagingXcmV4Junction",
                                name: "x1",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "StagingXcmV4Junction",
                                    name: "accountId32",
                                    rawType: "struct",
                                    children: [
                                      {
                                        type: "Option<StagingXcmV4JunctionNetworkId>",
                                        name: "network",
                                        rawType: "option",
                                        value: null,
                                      },
                                      {
                                        type: "H256",
                                        name: "id",
                                        rawType: "array",
                                        value:
                                          "0x54a64ecca7929558dae7c2207a1d8b4128fc8654a7df908d474376c1ca7a3479",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              null,
            ],
          },
          {
            type: "Call",
            section: "treasury",
            method: "spend",
            children: [
              {
                type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                name: "assetKind",
                rawType: "enum",
                children: [
                  {
                    type: "PolkadotRuntimeCommonImplsVersionedLocatableAsset",
                    name: "v5",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV5Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV5Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV5AssetAssetId",
                        name: "assetId",
                        rawType: "struct",
                        children: [
                          {
                            type: "StagingXcmV5Location",
                            name: "value",
                            rawType: "struct",
                            children: [
                              {
                                type: "u8",
                                name: "parents",
                                rawType: "primitive",
                                value: 0,
                              },
                              {
                                type: "StagingXcmV5Junctions",
                                name: "interior",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "[StagingXcmV5Junction; 2]",
                                    name: "x2",
                                    rawType: "array",
                                    children: [
                                      {
                                        type: "u8",
                                        name: "palletInstance",
                                        rawType: "primitive",
                                        value: 50,
                                      },
                                      {
                                        type: "Compact<u128>",
                                        name: "generalIndex",
                                        rawType: "compact",
                                        value: "1337",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "Compact<u128>",
                name: "amount",
                rawType: "compact",
                value: "11400000000",
              },
              {
                type: "ParachainsCommonPayVersionedLocatableAccount",
                name: "beneficiary",
                rawType: "enum",
                children: [
                  {
                    type: "ParachainsCommonPayVersionedLocatableAccount",
                    name: "v4",
                    rawType: "struct",
                    children: [
                      {
                        type: "StagingXcmV4Location",
                        name: "location",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                          },
                        ],
                      },
                      {
                        type: "StagingXcmV4Location",
                        name: "accountId",
                        rawType: "struct",
                        children: [
                          {
                            type: "u8",
                            name: "parents",
                            rawType: "primitive",
                            value: 0,
                          },
                          {
                            type: "StagingXcmV4Junctions",
                            name: "interior",
                            rawType: "enum",
                            children: [
                              {
                                type: "StagingXcmV4Junction",
                                name: "x1",
                                rawType: "enum",
                                children: [
                                  {
                                    type: "StagingXcmV4Junction",
                                    name: "accountId32",
                                    rawType: "struct",
                                    children: [
                                      {
                                        type: "Option<StagingXcmV4JunctionNetworkId>",
                                        name: "network",
                                        rawType: "option",
                                        value: null,
                                      },
                                      {
                                        type: "H256",
                                        name: "id",
                                        rawType: "array",
                                        value:
                                          "0x54a64ecca7929558dae7c2207a1d8b4128fc8654a7df908d474376c1ca7a3479",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              null,
            ],
          },
        ],
      },
    ],
  };
}
