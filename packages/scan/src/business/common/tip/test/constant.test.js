const { getTippersCount } = require("../utils");
const { getTipFindersFee } = require("../utils");
const {
  chain: { getApi },
  test: { setKarura, disconnect },
} = require("@subsquare/scan-common");
jest.setTimeout(3000000);

describe("test get tip", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("finders fee works", async () => {
    const height = 89001;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const fee = await getTipFindersFee({ blockHash, blockHeight: height });
    expect(fee).toEqual(5);
  });

  test("tippers count works", async () => {
    const height = 89001;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const count = await getTippersCount({ blockHash, blockHeight: height });
    expect(count).toEqual(6);
  });
});
