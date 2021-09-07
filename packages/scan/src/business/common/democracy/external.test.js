const { getExternalFromStorage } = require("./external");
const { setChain, CHAINS } = require("../../../env");
const { setSpecHeights } = require("../../../specs");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");

jest.setTimeout(3000000);

describe("test get karura external", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://karura.kusama.elara.patract.io", 1000);
    api = await ApiPromise.create({
      provider,
      typesBundle: { ...typesBundleForPolkadot },
    });

    setApi(api);
    setChain(CHAINS.KARURA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    // This external is created at 160503, when the 6th motion passed
    const height = 160545;
    const preHeight = height - 1;
    setSpecHeights([preHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(preHeight);
    const indexer = { blockHash, blockHeight: preHeight };

    const external = await getExternalFromStorage(indexer);
    expect(external).toEqual([
      "0x9e1c6ea3654eba6226ff60b4d2751064f88c46f1022d3f8422cc1ed23dfe8d91",
      "Simplemajority",
    ]);
  });
});
