const { testTechCommProposal } = require("./testData");
const { getTechCommMotionProposalCall } = require("./proposalStorage");
const {
  chain: {
    getApi,
    specs: { setSpecHeights },
  },
  test: { setKarura, disconnect },
} = require("@subsquare/scan-common");

jest.setTimeout(3000000);

describe("test get karura Tech Comm", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("motion proposal works", async () => {
    const blockHeight = 212454;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const motionHash =
      "0xca04d33103a7764c1f68dbbdbb0f42209de4b96673e1210b68b6f46feeecf700";

    const proposal = await getTechCommMotionProposalCall(motionHash, indexer);
    expect(proposal).toEqual(testTechCommProposal);
  });
});
