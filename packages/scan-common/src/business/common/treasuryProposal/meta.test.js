const { setKusama, disconnect } = require("../../../test");
const { getApi } = require("../../../chain");
jest.setTimeout(3000000);

const { getTreasuryProposalMeta } = require("./meta");

describe("test get treasury proposal", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("meta works", async () => {
    const height = 126165;
    const api = await getApi();
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
