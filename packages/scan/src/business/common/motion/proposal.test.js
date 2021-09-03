const { getMotionProposalCall } = require("./proposalStorage");
const { setSpecHeights } = require("../../../specs");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const { setChain, CHAINS } = require("../../../env");

jest.setTimeout(3000000);

const ksmTargetCall = {
  callIndex: "0x1202",
  section: "treasury",
  method: "approveProposal",
  args: [
    {
      name: "proposal_id",
      type: "Compact<ProposalIndex>",
      value: 0,
    },
  ],
};

const dotMotionCallByProxy = {
  callIndex: "0x1301",
  section: "treasury",
  method: "rejectProposal",
  args: [
    {
      name: "proposal_id",
      type: "Compact<ProposalIndex>",
      value: 33,
    },
  ],
};

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

describe("test get kusama motion proposal", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
    setChain(CHAINS.KUSAMA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    const blockHeight = 126209;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const motionHash =
      "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual(ksmTargetCall);
  });

  test("by proxy works", async () => {
    const blockHeight = 3543099;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };
    const motionHash =
      "0xc117d365995214adfdd5ae55e3de4dc52dc4082e882fe2df371bf2230e01fd50";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual(ksmTargetCall);
  });
});

describe("test get polkadot motion proposal", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(
      "wss://polkadot.api.onfinality.io/public-ws",
      1000
    );
    api = await ApiPromise.create({ provider });
    setApi(api);
    setChain(CHAINS.POLKADOT);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("by proxy works", async () => {
    const blockHeight = 3543099;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };
    const motionHash =
      "0xc117d365995214adfdd5ae55e3de4dc52dc4082e882fe2df371bf2230e01fd50";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual(dotMotionCallByProxy);
  });
});
