import newApi from "next-common/services/chain/apis/new";

export default async function getApi(chain, endpoint) {
  const api = await newApi(chain, endpoint);
  await api.isReady;
  return api;
}
