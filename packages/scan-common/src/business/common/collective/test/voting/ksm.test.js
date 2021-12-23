const {
  getCollectiveVoting,
  getCollectiveVotingByHeight,
} = require("../../voting");
const { setKusama } = require("../../../../../test/ksm");
const { getApi, disconnect } = require("../../../../../chain");
jest.setTimeout(3000000);

const ksmTestMotionHash =
  "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08";
const targetKsmMotion = {
  index: 15,
  threshold: 8,
  ayes: ["H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y"],
  nays: [],
};

describe("test get kusama motion", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("voting works", async () => {
    const blockHeight = 126209;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const voting = await getCollectiveVoting(
      "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08",
      indexer
    );
    expect(voting).toEqual(targetKsmMotion);
  });

  test("at height works", async () => {
    const blockHeight = 126209;

    const voting = await getCollectiveVotingByHeight(
      ksmTestMotionHash,
      blockHeight
    );
    expect(voting).toEqual(targetKsmMotion);
  });
});
