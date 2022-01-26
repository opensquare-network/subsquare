const { getApi, disconnect } = require("../../../../../chain");
const { setKarura } = require("../../../../../test/kar");
const { getPublicProposalDeposit } = require("../storage");
jest.setTimeout(3000000);

describe("test democracy public proposals deposit", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const blockHeight = 135713;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const proposalIndex = 0;
    const deposit = await getPublicProposalDeposit(proposalIndex, {
      blockHeight,
      blockHash,
    });

    expect(deposit).toEqual([
      ["sWcq8FAQXPdXGSaxSTBKS614hCB8YutkVWWacBKG1GbGS23"],
      1000000000000000,
    ]);
  });
});
