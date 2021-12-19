const { getMotionProposalCall } = require("./proposalStorage");
const {
  chain: {
    getApi,
    specs: { setSpecHeights },
  },
  test: { setPolkadot, setKusama, setKarura, disconnect },
} = require("@subsquare/scan-common");
jest.setTimeout(3000000);

const ksmTargetCall = {
  callIndex: "0x1202",
  section: "treasury",
  method: "approveProposal",
  args: [
    {
      name: "proposalId",
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
      name: "proposalId",
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
      name: "withDelayedOrigin",
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
            name: "asOrigin",
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

describe("test get karura ", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("motion proposal works", async () => {
    const height = 43249;
    await setSpecHeights([height]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0x83d4eafe293e21dc387c5b3b7eb1538d5b89f548dc0a469c41955e9928e98a36";

    const proposalRaw = await getMotionProposalCall(motionHash, indexer);
    expect(proposalRaw).toEqual(targetCall);
  });

  test("6th motion proposal works", async () => {
    const height = 160502;
    await setSpecHeights([height]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0x55b6298907985f2ad4ff2cf6fafb2ed65390aca0a24b5bc0c276a4b0d70e8abc";

    const proposalRaw = await getMotionProposalCall(motionHash, indexer);
    expect(proposalRaw).toEqual({
      callIndex: "0x4505",
      section: "democracy",
      method: "externalProposeMajority",
      args: [
        {
          name: "proposalHash",
          type: "Hash",
          value:
            "0x9e1c6ea3654eba6226ff60b4d2751064f88c46f1022d3f8422cc1ed23dfe8d91",
        },
      ],
    });
  });
});

describe("test get kusama motion proposal", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const blockHeight = 126209;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const motionHash =
      "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual(ksmTargetCall);
  });
});

describe("test get polkadot motion proposal", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("by proxy works", async () => {
    const blockHeight = 3543099;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };
    const motionHash =
      "0xc117d365995214adfdd5ae55e3de4dc52dc4082e882fe2df371bf2230e01fd50";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual(dotMotionCallByProxy);
  });
});
