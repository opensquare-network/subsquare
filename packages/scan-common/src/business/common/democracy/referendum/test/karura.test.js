const { setKarura } = require("../../../../../test/kar");
const {
  getReferendumInfoFromStorage,
  getReferendumInfoByHeight,
} = require("../storage");
const { getApi, disconnect } = require("../../../../../chain");

jest.setTimeout(3000000);

describe("test get karura referendum 1th info", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test(" when passed works", async () => {
    const blockHeight = 127523;
    const api = await getApi();
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
