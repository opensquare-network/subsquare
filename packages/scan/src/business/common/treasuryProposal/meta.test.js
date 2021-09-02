const { setApi } = require("../../../api");
jest.setTimeout(3000000);

const { getTreasuryProposalMeta } = require("./meta");
const { setSpecHeights } = require("../../../mongo/service/specs");
const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get treasury proposal", () => {
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

  test("meta works", async () => {
    const height = 126165;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const meta = await getTreasuryProposalMeta(0, {
      blockHash,
      blockHeight: height,
    });
    expect(meta).toEqual({
      proposer: "H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y",
      value: 50000000000000,
      beneficiary: "EaG2CRhJWPb7qmdcJvy3LiWdh26Jreu9Dx6R1rXxPmYXoDk",
      bond: 2500000000000,
    });
  });
});
