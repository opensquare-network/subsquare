const { getApi, disconnect } = require("../../../../../chain");
const { setKarura } = require("../../../../../test/kar");
const { getPublicProposalFromStorage } = require("../storage");
jest.setTimeout(3000000);

describe("test democracy assets proposals", () => {
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
    const proposal = await getPublicProposalFromStorage(proposalIndex, {
      blockHeight,
      blockHash,
    });
    expect(proposal).toEqual([
      0,
      "0x4f8bf2c02c5a1e8cdcf7a94dabf2805c563c46a87876c684c5d79ffb745db115",
      "sWcq8FAQXPdXGSaxSTBKS614hCB8YutkVWWacBKG1GbGS23",
    ]);
  });
});
