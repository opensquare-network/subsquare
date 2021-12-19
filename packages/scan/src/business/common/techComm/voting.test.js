const { getTechCommMotionVotingFromStorage } = require("./votingStorage");
const {
  chain: { getApi },
  test: { setKarura, disconnect },
} = require("@subsquare/scan-common");

jest.setTimeout(3000000);

describe("test get karura Tech.Comm. voting", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const height = 50556;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0xafd9cc9c72c0b23f64d971458fa51ffc7b4fcb9fdb9e9edde0edf325340a5ed4";

    const voting = await getTechCommMotionVotingFromStorage(
      motionHash,
      indexer
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
