const { dotMotionCallByProxy } = require("./data");
const { getCollectiveNormalizedCall } = require("../proposal");
const { setSpecHeights } = require("../../../../chain/specs");
const { setPolkadot } = require("../../../../test/dot");
const { getApi, disconnect } = require("../../../../chain");
jest.setTimeout(3000000);

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

    const normalizedProposal = await getCollectiveNormalizedCall(
      motionHash,
      indexer
    );
    expect(normalizedProposal).toEqual(dotMotionCallByProxy);
  });
});
