const { getReferendumInfoFromStorage } = require("./referendumStorage");
const { CHAINS } = require("../../../../env");
const { setChain } = require("../../../../env");
const { setApi } = require("../../../../api");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get kusama referendum 8th info", () => {
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
    const blockHeight = 100800;
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const referendumIndex = 8;
    const referendumInfo = await getReferendumInfoFromStorage(
      referendumIndex,
      indexer
    );
    expect(referendumInfo).toEqual({
      end: 201600,
      proposalHash:
        "0x1c0a116889e9584b6709bf01235ece86c285597801c40826dbccd67f187739fe",
      threshold: "SuperMajorityApprove",
      delay: 115200,
    });
  });
});
