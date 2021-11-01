const { getBountyDescription } = require("./description");
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

  test("description of kusama bounty#0 works", async () => {
    const height = 4501546;
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const description = await getBountyDescription(0, {
      blockHash,
      blockHeight: height,
    });
    expect(description).toEqual("Kusama network UI Bounty");
  });
});
