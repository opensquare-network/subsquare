const { getTipReason } = require("../utils");
jest.setTimeout(3000000);
const {
  test: { setKhala, disconnect },
} = require("@subsquare/scan-common");

describe("test get khala tip reason", () => {
  beforeAll(async () => {
    await setKhala();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const indexer = {
      blockHeight: 697365,
      blockHash:
        "0x38f88d04ba5952bd5efb879d057a26a8493f8e39b528758f1f567a92cb2a8b11",
    };
    const reasonHash =
      "0x999c2d712daff14e51f9b6f7ae746eee217f71bf3465e0df3b240ee857b36aeb";

    const reason = await getTipReason(reasonHash, indexer);
    expect(reason).toEqual(
      "Reimbursement Meetup Düsseldorf: https://forum.phala.network/t/topic/3218"
    );
  });
});
