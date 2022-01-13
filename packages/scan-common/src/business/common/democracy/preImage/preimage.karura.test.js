const { setKarura } = require("../../../../test/kar");
const { setSpecHeights } = require("../../../../chain/specs");
const { getPreImageFromStorage } = require("./storage");
const { getApi, disconnect } = require("../../../../chain");
jest.setTimeout(3000000);

describe("test get karura image at", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("120301 works", async () => {
    const blockHeight = 120301;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const hash =
      "0x8e70a75aefd616389767cb02f5c900edaf2f7b645b2a7db01c525ac6d3b26a8a";
    const image = await getPreImageFromStorage(hash, indexer);
    expect(image).toEqual({
      data: "0x1e03bc30ed7c6618cab42b2cc94a62e4c576be7f733c1f53b692f6ae37305edd6eeb",
      provider: "ouJX1WJQ9s4RMukAx5zvMwPY2zJZ9Xr5euzRG97Ne6UTNG9",
      deposit: 3400000000,
      since: 120301,
      expiry: null,
      imageValid: true,
      call: {
        callIndex: "0x1e03",
        section: "parachainSystem",
        method: "authorizeUpgrade",
        args: [
          {
            name: "codeHash",
            type: "Hash",
            value:
              "0xbc30ed7c6618cab42b2cc94a62e4c576be7f733c1f53b692f6ae37305edd6eeb",
          },
        ],
      },
    });
  });

  test("684147 works", async () => {
    const blockHeight = 684147;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const hash =
      "0xc429a712946be341bd27bcff88d5031adc59cee5b59913019180b6bfd5223970";
    const image = await getPreImageFromStorage(hash, indexer);

    expect(image.call).toEqual({
      callIndex: "0xff03",
      section: "sudo",
      method: "sudoAs",
      args: [
        {
          name: "who",
          type: "LookupSource",
          value: {
            id: "qmmNufxeWaAUp4SVa1Vi1owrzP1xhR6XKdorEcck17RF498",
          },
        },
        {
          name: "call",
          type: "Call",
          value: {
            callIndex: "0x0c00",
            section: "currencies",
            method: "transfer",
            args: [
              {
                name: "dest",
                type: "LookupSource",
                value: {
                  id: "sL5vYdcwtv84c4M9SeUxTyBX421PJ3FDB2adxgkVuZr8GSM",
                },
              },
              {
                name: "currencyId",
                type: "CurrencyIdOf",
                value: {
                  token: "KUSD",
                },
              },
              {
                name: "amount",
                type: "Compact<BalanceOf>",
                value: "7696165666510504000000000000",
              },
            ],
          },
        },
      ],
    });
  });
});
