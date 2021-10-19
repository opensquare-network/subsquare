const { getExternalFromStorageByHeight } = require("./external");
const { onFinalityKarura } = require("../../../utils/constants");
const { getExternalFromStorage } = require("./external");
const { setChain, CHAINS } = require("../../../env");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");

jest.setTimeout(3000000);

describe("test get karura external", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(onFinalityKarura, 1000);
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
    const blockHash = await api.rpc.chain.getBlockHash(preHeight);
    const indexer = { blockHash, blockHeight: preHeight };

    const external = await getExternalFromStorage(indexer);
    // Fast tracked by sudo(sudo)
    expect(external).toEqual([
      "0x9e1c6ea3654eba6226ff60b4d2751064f88c46f1022d3f8422cc1ed23dfe8d91",
      "SimpleMajority",
    ]);
  });

  test("at 653005 works", async () => {
    // This external is created at 160503, when the 6th motion passed
    const height = 653005;
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const external = await getExternalFromStorage(indexer);
    // Fast tracked by sudo(sudo)
    expect(external).toEqual([
      "0x3dfe99860fe5d3431f30ccc8fc062509f583bf65f3084b09d4e1c1f66e162260",
      "SimpleMajority",
    ]);
  });

  test("at 611909 works", async () => {
    // This external is created at 160503, when the 6th motion passed
    const height = 611909;

    const external = await getExternalFromStorageByHeight(height);
    // Fast tracked by sudo(sudo)
    expect(external).toEqual([
      "0x9041c5b570aa07440e9f406af7969798ca0e6bf3c0dfccb4b0076fe484a4de16",
      "SimpleMajority",
    ]);
  });
});
