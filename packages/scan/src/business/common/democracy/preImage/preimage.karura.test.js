const { onFinalityKarura } = require("../../../../utils/constants");
const { getPreImageFromStorage } = require("./storage");
const { setSpecHeights } = require("../../../../chain/specs");
const { CHAINS } = require("../../../../env");
const { setChain } = require("../../../../env");
const { setApi } = require("../../../../api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get karura 1st proposal image", () => {
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

  test(" works", async () => {
    const blockHeight = 120301;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const hash =
      "0x8e70a75aefd616389767cb02f5c900edaf2f7b645b2a7db01c525ac6d3b26a8a";
    const image = await getPreImageFromStorage(hash, indexer);
    expect(image).toEqual({
      data: "0x1e03bc30ed7c6618cab42b2cc94a62e4c576be7f733c1f53b692f6ae37305edd6eeb",
      provider: "ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9",
      deposit: 3400000000,
      since: 120301,
      expiry: null,
      imageValid: true,
      call: {
        callIndex: "0x1e03",
        section: "parachainSystem",
        method: "authorizeUpgrade",
        args: [
          {
            name: "codeHash",
            type: "Hash",
            value:
              "0xbc30ed7c6618cab42b2cc94a62e4c576be7f733c1f53b692f6ae37305edd6eeb",
          },
        ],
      },
    });
  });
});
