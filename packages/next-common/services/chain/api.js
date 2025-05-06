import newApi, { newOriginApi } from "next-common/services/chain/apis/new";

export async function getApi(chain, endpoint) {
  const api = await newApi(chain, endpoint);
  await api.isReady;
  return api;
}

export async function getOriginApi(chain, endpoint) {
  const api = await newOriginApi(chain, endpoint);
  await api.isReady;
  return api;
}

async function timeoutInSeconds(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(reject, seconds * 1000);
  });
}

export default function getApiInSeconds(chain, endpoint) {
  return Promise.race([getOriginApi(chain, endpoint), timeoutInSeconds(10)]);
}

export async function getBlockApiByHeight(api, blockHeight) {
  const instance = await api.rpc.chain
    .getBlockHash(blockHeight)
    .then((blockHash) => api.at(blockHash));

  return instance;
}
