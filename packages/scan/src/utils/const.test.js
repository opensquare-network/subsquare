const { getConstFromRegistry } = require("./index");
const { findRegistry } = require("../specs");
const { setSpecHeights } = require("../specs");
const { CHAINS } = require("../env");
const { setChain } = require("../env");
const { setApi } = require("../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");

jest.setTimeout(3000000);

describe("Test kusama const", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
    setChain(CHAINS.KUSAMA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    const blockHeight = 3543099;
    setSpecHeights([blockHeight]);
    const registry = await findRegistry(blockHeight);

    const target = getConstFromRegistry(
      registry,
      "ElectionsPhragmen",
      "DesiredMembers"
    );
    expect(target.toNumber()).toEqual(17);
  });
});
