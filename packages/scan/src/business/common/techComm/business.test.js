const { extractTechCommMotionBusiness } = require("./extractBusiness");
const { getTechCommMotionProposal } = require("./proposalStorage");
const {
  chain: {
    getApi,
    specs: { setSpecHeights },
  },
  test: { setKarura, disconnect },
} = require("@subsquare/scan-common");

jest.setTimeout(3000000);

xdescribe("test extract karura Tech Comm", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("motion business works", async () => {
    const blockHeight = 1064927;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
    const blockHash = (await api.rpc.chain.getBlockHash(blockHeight)).toHex();
    const indexer = { blockHash, blockHeight };

    const motionHash =
      "0x389bfec2679b2f640b726614192f9359ecb52797a993373d482d39e6582315d0";

    const call = await getTechCommMotionProposal(motionHash, indexer);
    const singer = "ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9";
    const business = await extractTechCommMotionBusiness(
      call,
      singer,
      indexer,
      []
    );

    expect(business).toEqual({
      externalProposals: [
        {
          hash: "0xf0145014a97fbbd5ade3ce47558ffb0474c149c91214493d8789a7cb57d5bcc5",
          method: "fastTrack",
        },
      ],
    });
  });
});
