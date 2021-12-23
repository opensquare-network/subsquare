const { setSpecHeights } = require("../../../../chain/specs");
const { setKarura } = require("../../../../test/kar");
const { getCollectiveNormalizedCall } = require("../proposal");
const { getApi, disconnect } = require("../../../../chain");
jest.setTimeout(3000000);

describe("test get karura Tech Comm", () => {
  beforeAll(async () => {
    await setKarura();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("motion proposal works", async () => {
    const blockHeight = 212454;
    await setSpecHeights([blockHeight]);
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const indexer = { blockHash, blockHeight };

    const motionHash =
      "0xca04d33103a7764c1f68dbbdbb0f42209de4b96673e1210b68b6f46feeecf700";

    const proposal = await getCollectiveNormalizedCall(
      motionHash,
      indexer,
      "technicalCommittee"
    );
    expect(proposal).toEqual({
      callIndex: "0x3c02",
      section: "authority",
      method: "fastTrackScheduledDispatch",
      args: [
        {
          name: "initialOrigin",
          type: "PalletsOrigin",
          value: {
            authority: {
              delay: 50400,
              origin: {
                generalCouncil: {
                  members: [5, 6],
                },
              },
            },
          },
        },
        {
          name: "taskId",
          type: "ScheduleTaskIndex",
          value: 2,
        },
        {
          name: "when",
          type: "DispatchTime",
          value: {
            after: 1,
          },
        },
      ],
    });
  });
});
