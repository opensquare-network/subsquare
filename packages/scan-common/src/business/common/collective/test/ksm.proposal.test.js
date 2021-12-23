const { ksmTargetCall } = require("./data");
const { getCollectiveNormalizedCall } = require("../proposal");
const { setSpecHeights } = require("../../../../chain/specs");
const { setKusama } = require("../../../../test/ksm");
const { getApi, disconnect } = require("../../../../chain");
jest.setTimeout(3000000);

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

    const normalizedProposal = await getCollectiveNormalizedCall(
      motionHash,
      indexer
    );
    expect(normalizedProposal).toEqual(ksmTargetCall);
  });
});
