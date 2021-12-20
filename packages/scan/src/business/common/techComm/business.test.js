const { extractTechCommMotionBusiness } = require("./extractBusiness");
const { getTechCommMotionProposal } = require("./proposalStorage");
const { setSpecHeights } = require("../../../chain/specs");
const { karuraEndpoint } = require("../../../utils/constants");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
const { setChain, CHAINS } = require("../../../env");
const { setApi } = require("../../../api");

jest.setTimeout(3000000);

xdescribe("test extract karura Tech Comm", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(karuraEndpoint, 1000);
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

  test("motion business works", async () => {
    const blockHeight = 1064927;
    setSpecHeights([blockHeight]);
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
