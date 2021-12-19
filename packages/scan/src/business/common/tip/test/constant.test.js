const { karuraEndpoint } = require("../../../../utils/constants");
const { getTippersCount } = require("../utils");
const { getTipFindersFee } = require("../utils");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const {
  chain: { setApi, setProvider },
  env: { setChain, CHAINS },
} = require("@subsquare/scan-common");
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
    setProvider(provider);
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("finders fee works", async () => {
    const height = 89001;
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const fee = await getTipFindersFee({ blockHash, blockHeight: height });
    expect(fee).toEqual(5);
  });

  test("tippers count works", async () => {
    const height = 89001;
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const count = await getTippersCount({ blockHash, blockHeight: height });
    expect(count).toEqual(6);
  });
});
