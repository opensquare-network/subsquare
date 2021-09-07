const { getTechCommMotionProposalCall } = require("./proposalStorage");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const { setApi } = require("../../../api");
const { setChain, CHAINS } = require("../../../env");
const { setSpecHeights } = require("../../../specs");

jest.setTimeout(3000000);

describe("test get karura Tech Comm", () => {
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

  test("", async () => {
    const blockHeight = 212454;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const motionHash =
      "0xca04d33103a7764c1f68dbbdbb0f42209de4b96673e1210b68b6f46feeecf700";

    const proposal = await getTechCommMotionProposalCall(motionHash, indexer);
    expect(proposal).toEqual({});
  });
});
