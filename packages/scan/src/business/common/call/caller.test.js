const { getRealCaller } = require("./getRealCaller");
const {
  chain: { getApi },
  test: { setKusama, disconnect },
} = require("@subsquare/scan-common");

jest.setTimeout(3000000);

describe("test get ", () => {
  beforeAll(async () => {
    await setKusama();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("real caller of proxy works", async () => {
    const height = 9849609;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const block = await api.rpc.chain.getBlock(blockHash);
    const extrinsic = block.block.extrinsics[2];

    const singer = getRealCaller(extrinsic.method, extrinsic.signer.toString());
    expect(singer).toEqual("Gth5jQA6v9EFbpqSPgXcsvpGSrbTdWwmBADnqa36ptjs5m5");
  });

  test("real caller of multisig works", async () => {
    const height = 9764791;
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const block = await api.rpc.chain.getBlock(blockHash);
    const extrinsic = block.block.extrinsics[5];

    const singer = getRealCaller(extrinsic.method, extrinsic.signer.toString());
    expect(singer).toEqual("DWUAQt9zcpnQt5dT48NwWbJuxQ78vKRK9PRkHDkGDn9TJ1j");
  });
});
