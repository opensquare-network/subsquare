const { getCollectiveVoting } = require("../../voting");
const { setKarura } = require("../../../../../test/kar");
const { getApi, disconnect } = require("../../../../../chain");
const { Modules } = require("../../../constants");
jest.setTimeout(3000000);

describe("test get karura", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("motion voting works", async () => {
    const height = 43249;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0x83d4eafe293e21dc387c5b3b7eb1538d5b89f548dc0a469c41955e9928e98a36";

    const voting = await getCollectiveVoting(
      motionHash,
      indexer,
      "generalCouncil"
    );
    expect(voting).toEqual({
      index: 0,
      threshold: 5,
      ayes: ["ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9"],
      nays: [],
      end: 64849,
    });
  });

  test("tech comm voting works", async () => {
    const height = 50556;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0xafd9cc9c72c0b23f64d971458fa51ffc7b4fcb9fdb9e9edde0edf325340a5ed4";

    const voting = await getCollectiveVoting(
      motionHash,
      indexer,
      Modules.TechnicalCommittee
    );
    expect(voting).toEqual({
      index: 0,
      threshold: 3,
      ayes: ["ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9"],
      nays: [],
      end: 72156,
    });
  });
});
