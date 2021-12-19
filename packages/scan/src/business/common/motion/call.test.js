const { GenericCall } = require("@polkadot/types");
const { normalizeCall } = require("./utils");
const { getMotionProposal } = require("./proposalStorage");
const {
  chain: {
    getApi,
    specs: { setSpecHeights, findRegistry },
  },
  test: { setKarura, disconnect },
} = require("@subsquare/scan-common");
jest.setTimeout(3000000);

describe("Normalize call", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("works", async () => {
    const blockHeight = 256518;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
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
