const { setKusama } = require("../../../../../test/ksm");
const { getApi, disconnect } = require("../../../../../chain");
const { getReferendumInfoFromStorage } = require("../storage");
jest.setTimeout(3000000);

describe("test get kusama referendum 8th info", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const blockHeight = 100800;
    const api = await getApi();
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
