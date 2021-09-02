const { setChain, CHAINS } = require("../../../env");
const {
  getMotionVoting,
  getVotingFromStorageByHeight,
} = require("./votingStorage");
const { setSpecHeights } = require("../../../mongo/service/specs");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");

jest.setTimeout(3000000);

const ksmTestMotionHash =
  "0x59fe7bd64951667f91f36db33077b1ada93b093b363a32cf869d2a833d72ce08";
const targetKsmMotion = {
  index: 15,
  threshold: 8,
  ayes: ["H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y"],
  nays: [],
};

describe("test get karura motion", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://karura.kusama.elara.patract.io", 1000);
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
    const height = 43249;
    setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const indexer = { blockHash, blockHeight: height };

    const motionHash =
      "0x83d4eafe293e21dc387c5b3b7eb1538d5b89f548dc0a469c41955e9928e98a36";

    const voting = await getMotionVoting(motionHash, indexer);
    expect(voting).toEqual({
      index: 0,
      threshold: 5,
      ayes: ["ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9"],
      nays: [],
      end: 64849,
    });
  });
});

describe("test get kusama motion", () => {
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
    const blockHeight = 126209;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const voting = await getMotionVoting(targetKsmMotion, indexer);
    expect(voting).toEqual(targetKsmMotion);
  });

  test("at height works", async () => {
    const blockHeight = 126209;
    setSpecHeights([blockHeight]);

    const voting = await getVotingFromStorageByHeight(
      ksmTestMotionHash,
      blockHeight
    );
    expect(voting).toEqual(targetKsmMotion);
  });
});
