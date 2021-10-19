const { karuraEndpoint } = require("../../../../utils/constants");
const { CHAINS } = require("../../../../env");
const { setChain } = require("../../../../env");
const { getTippersCount } = require("../utils");
const { getTipFindersFee } = require("../utils");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { setApi } = require("../../../../api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
jest.setTimeout(3000000);

describe("test get tip", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(karuraEndpoint, 1000);
    api = await ApiPromise.create({
      provider,
      typesBundle: { ...typesBundleForPolkadot },
    });

    setChain(CHAINS.KARURA);
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("finders fee works", async () => {
    const height = 89001;
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const fee = await getTipFindersFee(blockHash);
    expect(fee).toEqual(5);
  });

  test("tippers count works", async () => {
    const height = 89001;
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const count = await getTippersCount(blockHash);
    expect(count).toEqual(6);
  });
});
