const {
  getReferendumInfoFromStorage,
  getReferendumInfoByHeight,
} = require("./referendumStorage");
const { CHAINS } = require("../../../../env");
const { setChain } = require("../../../../env");
const { setApi } = require("../../../../api");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get karura referendum 1th info", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/karura", 1000);
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

  test(" when passed works", async () => {
    const blockHeight = 127523;
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const referendumIndex = 0;
    const referendumInfo = await getReferendumInfoFromStorage(
      referendumIndex,
      indexer
    );
    expect(referendumInfo).toEqual({
      finished: {
        approved: true,
        end: 127523,
      },
    });
  });

  test(" before passed works", async () => {
    const blockHeight = 127523;

    const referendumIndex = 0;
    const referendumInfo = await getReferendumInfoByHeight(
      referendumIndex,
      blockHeight - 1
    );
    expect(referendumInfo).toEqual({
      ongoing: {
        end: 127523,
        proposalHash:
          "0x8e70a75aefd616389767cb02f5c900edaf2f7b645b2a7db01c525ac6d3b26a8a",
        threshold: "SimpleMajority",
        delay: 20,
        tally: {
          ayes: 763267690000000,
          nays: 1039640000000,
          turnout: 1369634000000000,
        },
      },
    });
  });
});
