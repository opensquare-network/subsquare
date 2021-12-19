const { getBountyMeta } = require("./meta");
jest.setTimeout(3000000);
const {
  chain: { getApi },
  test: { setKusama, disconnect },
} = require("@subsquare/scan-common");

describe("test get ", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("meta of kusama bounty#0 works", async () => {
    const height = 4501546;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const meta = await getBountyMeta(0, {
      blockHash,
      blockHeight: height,
    });
    expect(meta).toEqual({
      proposer: "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
      value: 1165000000000000,
      fee: 0,
      curatorDeposit: 0,
      bond: 206666666650,
      status: {
        proposed: null,
      },
    });
  });
});
