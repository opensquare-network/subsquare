const { getRealCaller } = require("./getRealCaller");
const { setApi } = require("../../../api");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

describe("test get ", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://kusama.api.onfinality.io/public-ws", 1000);
    api = await ApiPromise.create({ provider });
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("real caller of proxy works", async () => {
    const height = 9849609;
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const block = await api.rpc.chain.getBlock(blockHash);
    const extrinsic = block.block.extrinsics[2];

    const singer = getRealCaller(extrinsic.method, extrinsic.signer.toString());
    expect(singer).toEqual("Gth5jQA6v9EFbpqSPgXcsvpGSrbTdWwmBADnqa36ptjs5m5");
  });

  test("real caller of multisig works", async () => {
    const height = 9764791;
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const block = await api.rpc.chain.getBlock(blockHash);
    const extrinsic = block.block.extrinsics[5];

    const singer = getRealCaller(extrinsic.method, extrinsic.signer.toString());
    expect(singer).toEqual("DWUAQt9zcpnQt5dT48NwWbJuxQ78vKRK9PRkHDkGDn9TJ1j");
  });
});
