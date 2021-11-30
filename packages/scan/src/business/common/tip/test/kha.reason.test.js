const { getTipReason } = require("../utils");
const { khalaEndpoint } = require("../../../../utils/constants");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { versionedKhala, typesChain } = require("@phala/typedefs");
const { setChain, CHAINS } = require("../../../../env");
const { setApi } = require("../../../../api");
jest.setTimeout(3000000);

describe("test get khala tip reason", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(khalaEndpoint, 1000);
    const options = {
      typesBundle: {
        spec: {
          khala: versionedKhala,
        },
      },
      typesChain,
      provider,
    };

    api = await ApiPromise.create(options);
    setApi(api);
    setChain(CHAINS.KHALA);
  });

  afterAll(async () => {
    await provider.disconnect();
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
