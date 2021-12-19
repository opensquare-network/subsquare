const { khalaEndpoint } = require("../../../../utils/constants");
const { getPreImageFromStorage } = require("./storage");
const {
  chain: {
    setApi,
    setProvider,
    specs: { setSpecHeights },
  },
  env: { setChain, CHAINS },
} = require("@subsquare/scan-common");

const { versionedKhala, typesChain } = require("@phala/typedefs");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get khala democracy image", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(khalaEndpoint, 1000);

    api = await ApiPromise.create({
      typesBundle: {
        spec: {
          khala: versionedKhala,
        },
      },
      typesChain,
      provider,
    });

    setProvider(provider);
    setApi(api);
    setChain(CHAINS.KHALA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test(" works", async () => {
    const blockHeight = 319291;
    await setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const hash =
      "0x2effd00542302238f42f3cdc82f7cad834bcdaa5427627eccd1c0c9c828c0366";
    const image = await getPreImageFromStorage(hash, indexer);
    expect(image).toEqual({
      data: "0x000134546573742070726f706f73616c",
      provider: "41oM1N6UHbh8d42VMn8Vpvn7Wk6LyG4sefftgHaj12zWU47v",
      deposit: 160000000000,
      since: 319291,
      expiry: null,
      imageValid: true,
      call: {
        callIndex: "0x0001",
        section: "system",
        method: "remark",
        args: [
          {
            name: "remark",
            type: "Bytes",
            value: "0x546573742070726f706f73616c",
          },
        ],
      },
    });
  });
});
