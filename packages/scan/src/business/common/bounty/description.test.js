const { getBountyDescription } = require("./description");
const {
  chain: { getApi },
  test: { setKusama, disconnect },
} = require("@subsquare/scan-common");
jest.setTimeout(3000000);

describe("test get ", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("description of kusama bounty#0 works", async () => {
    const height = 4501546;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const description = await getBountyDescription(0, {
      blockHash,
      blockHeight: height,
    });
    expect(description).toEqual("Kusama network UI Bounty");
  });
});
