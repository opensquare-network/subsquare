import newApi from "next-common/services/chain/apis/new";

export default async function getApi(chain, endpoint) {
  const api = newApi(chain, endpoint);
  await api.isReady;
  return api;
}

export function getBestApi(apiMap) {
  let promises = [];
  for (const api of apiMap.values()) {
    promises.push(api.isReady);
  }

  return Promise.any(promises);
}
