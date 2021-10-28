const { getBountyMeta } = require("./meta");
const { setApi } = require("../../../api");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get ", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("meta of kusama bounty#0 works", async () => {
    const height = 4501546;
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
