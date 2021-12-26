const { getTipReason } = require("../utils");
const { getTipMetaFromStorage } = require("../utils");
const {
  chain: {
    findBlockApi,
    getApi,
    specs: { setSpecHeights },
  },
  test: { setKarura, disconnect },
} = require("@subsquare/scan-common");

jest.setTimeout(3000000);

describe("test get tip", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("meta works", async () => {
    const height = 89001;
    await setSpecHeights([height]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const tipHash =
      "0xc2851d861936fc5e3239fb90b1bdd2b2c2ca2e8823fff145468cf19bc0148740";
    const blockApi = await findBlockApi(blockHash);
    const meta = await getTipMetaFromStorage(blockApi, tipHash, {
      blockHeight: height,
      blockHash,
    });
    expect(meta).toEqual({
      reason:
        "0xb6d3c6af46ec04565e8aead8ee77f605547069eb69aad8e92a719c0c13490e5e",
      who: "sFNedNX6LQd2yQAAMSWy3kXcPznZ6g1GtS2Lfug7M7UeStv",
      finder: "sFNedNX6LQd2yQAAMSWy3kXcPznZ6g1GtS2Lfug7M7UeStv",
      deposit: 2008600000000,
      closes: null,
      tips: [],
      findersFee: true,
    });
  });

  test("reason works", async () => {
    const height = 89001;
    await setSpecHeights([height]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const reason = await getTipReason(
      "0xb6d3c6af46ec04565e8aead8ee77f605547069eb69aad8e92a719c0c13490e5e",
      {
        blockHeight: height,
        blockHash,
      }
    );
    expect(reason).toEqual(
      "https://yungbeefbigbags.medium.com/acala-and-karura-the-overlords-of-defi-e2a29e66c423"
    );
  });
});
