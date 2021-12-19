const { getMotionProposalCall } = require("../proposalStorage");
const { khalaEndpoint } = require("../../../../utils/constants");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { versionedKhala, typesChain } = require("@phala/typedefs");
const {
  chain: {
    setApi,
    setProvider,
    specs: { setSpecHeights },
  },
  env: { setChain, CHAINS },
} = require("@subsquare/scan-common");

jest.setTimeout(3000000);

describe("test get khala motion proposal", () => {
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
    setProvider(provider);
    setApi(api);
    setChain(CHAINS.KHALA);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("works", async () => {
    const blockHeight = 411735;
    await setSpecHeights([411139]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };
    const motionHash =
      "0x29d8886d0c896479185b813e9f3ddbbbe09e18aea1bd1e7dd67a51f49f8fadba";

    const normalizedProposal = await getMotionProposalCall(motionHash, indexer);
    expect(normalizedProposal).toEqual({
      callIndex: "0x0302",
      section: "utility",
      method: "batchAll",
      args: [
        {
          name: "calls",
          type: "Vec<Call>",
          value: [
            {
              callIndex: "0x5607",
              section: "phalaRegistry",
              method: "addPruntime",
              args: [
                {
                  name: "pruntimeHash",
                  type: "Bytes",
                  value:
                    "0x2099244f418ee770f71173f99956c23873f25f65c874082040010dff0a027a8300000000815f42f11cf64430c30bab7816ba596a1da0130c3b028b673133a66cf9a3e0e6",
                },
              ],
            },
            {
              callIndex: "0x5609",
              section: "phalaRegistry",
              method: "addRelaychainGenesisBlockHash",
              args: [
                {
                  name: "genesisBlockHash",
                  type: "H256",
                  value:
                    "0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe",
                },
              ],
            },
            {
              callIndex: "0x5609",
              section: "phalaRegistry",
              method: "addRelaychainGenesisBlockHash",
              args: [
                {
                  name: "genesisBlockHash",
                  type: "H256",
                  value:
                    "0xff93a4a903207ad45af110a3e15f8b66c903a0045f886c528c23fe7064532b08",
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
