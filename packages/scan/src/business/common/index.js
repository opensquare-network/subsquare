const {
  chain: { getApi },
} = require("@subsquare/scan-common");

async function getBlockHash(height) {
  const api = await getApi();
  return await api.rpc.chain.getBlockHash(height);
}

module.exports = {
  getBlockHash,
};
