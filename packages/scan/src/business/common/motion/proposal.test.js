const { getMotionProposalCall } = require("./proposalStorage");
const { setSpecHeights } = require("../../../mongo/service/specs");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const { setChain, CHAINS } = require("../../../env");

jest.setTimeout(3000000);

const targetCall = {
  callIndex: "0x3c01",
  section: "authority",
  method: "scheduleDispatch",
  args: [
    {
      name: "when",
      type: "DispatchTime",
      value: {
        after: 50400,
      },
    },
    {
      name: "priority",
      type: "Priority",
      value: 254,
    },
    {
      name: "with_delayed_origin",
      type: "bool",
      value: true,
    },
    {
      name: "call",
      type: "CallOf",
      value: {
        callIndex: "0x3c00",
        section: "authority",
        method: "dispatchAs",
        args: [
          {
            name: "as_origin",
            type: "AsOriginId",
            value: "Root",
          },
          {
            name: "call",
            type: "CallOf",
            value: {
              callIndex: "0x0a02",
              section: "balances",
              method: "forceTransfer",
              args: [
                {
                  name: "source",
                  type: "LookupSource",
                  value: {
                    id: "tFBV65Ts7wpQPxGM6PET9euNzp4pXdi9DVtgLZDJoFveR9F",
                  },
                },
                {
                  name: "dest",
                  type: "LookupSource",
                  value: {
                    id: "qmmNufxeWaAVLMER2va1v4w2HbuU683c5gGtuxQG4fKTZSb",
                  },
                },
                {
                  name: "value",
                  type: "Compact<Balance>",
                  value: 10000000000000,
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

describe("test get karura motion proposal", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://karura.kusama.elara.patract.io", 1000);
    api = await ApiPromise.create({
      provider,
      typesBundle: { ...typesBundleForPolkadot },
    });

    setApi(api);
    setChain(CHAINS.KARURA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    const height = 43249;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0x83d4eafe293e21dc387c5b3b7eb1538d5b89f548dc0a469c41955e9928e98a36";

    const proposalRaw = await getMotionProposalCall(motionHash, indexer);
    expect(proposalRaw).toEqual(targetCall);
  });
});
