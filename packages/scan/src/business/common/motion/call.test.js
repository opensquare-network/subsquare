const { findRegistry } = require("../../../chain/specs");
const { onFinalityKarura } = require("../../../utils/constants");
const { GenericCall } = require("@polkadot/types");
const { normalizeCall } = require("./utils");
const { getMotionProposal } = require("./proposalStorage");
const { setSpecHeights } = require("../../../chain/specs");
const { setApi } = require("../../../api");
const { ApiPromise, WsProvider } = require("@polkadot/api");
const { setChain, CHAINS } = require("../../../env");
const { typesBundleForPolkadot } = require("@acala-network/type-definitions");

jest.setTimeout(3000000);

describe("Normalize call", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider(onFinalityKarura, 1000);
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
    const blockHeight = 256518;
    setSpecHeights([blockHeight]);
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };
    const motionHash =
      "0xd82dbe78317f125e2dbbc8420e6a1b478ac11da25f8014031653f32a773e4952";

    const proposal = await getMotionProposal(motionHash, indexer);
    const registry = await findRegistry(indexer);
    const call = normalizeCall(new GenericCall(registry, proposal.toHex()));
    expect(call).toEqual({
      callIndex: "0x0300",
      section: "utility",
      method: "batch",
      args: [
        {
          name: "calls",
          type: "Vec<Call>",
          value: [
            {
              callIndex: "0x4700",
              section: "operatorMembershipAcala",
              method: "addMember",
              args: [
                {
                  name: "who",
                  type: "AccountId",
                  value: "rAJJxrDbJxG4WToARuwWQTjsGAX6HDuhxRuKnnMRuNrGq5K",
                },
              ],
            },
            {
              callIndex: "0x4700",
              section: "operatorMembershipAcala",
              method: "addMember",
              args: [
                {
                  name: "who",
                  type: "AccountId",
                  value: "tQcWARYTJHKTPTiN7LMQPmohrRc3467kApPsgvt5wU2EJat",
                },
              ],
            },
            {
              callIndex: "0x4700",
              section: "operatorMembershipAcala",
              method: "addMember",
              args: [
                {
                  name: "who",
                  type: "AccountId",
                  value: "q7kCWmJ9M7MqtmP4KnDpsaoJgW7LRNbz26j3L7Vw9jFKxZo",
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
