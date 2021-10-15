const { karuraEndpoint } = require("../../../utils/constants");
const { setChain, CHAINS } = require("../../../env");
const { getTechCommMotionVotingFromStorage } = require("./votingStorage");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");

jest.setTimeout(3000000);

describe("test get karura Tech.Comm. voting", () => {
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

  test("works", async () => {
    const height = 50556;
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0xafd9cc9c72c0b23f64d971458fa51ffc7b4fcb9fdb9e9edde0edf325340a5ed4";

    const voting = await getTechCommMotionVotingFromStorage(
      motionHash,
      indexer
    );
    expect(voting).toEqual({
      index: 0,
      threshold: 3,
      ayes: ["ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9"],
      nays: [],
      end: 72156,
    });
  });
});
