import { getChainApi } from "../getChainApi";
import getChainSettings from "../consts/settings";
import Chains from "next-common/utils/consts/chains";

const runtimeApiTypes = {
  PalletCurrenciesRpcRuntimeApiAccountData: {
    free: "Balance",
    reserved: "Balance",
    frozen: "Balance",
  },
};

const runtimeApiMethods = {
  CurrenciesApi: {
    account: {
      description: "Query account data for a specific currency",
      params: [
        { name: "account_id", type: "AccountId" },
        { name: "currency_id", type: "CurrencyId" },
      ],
      type: "PalletCurrenciesRpcRuntimeApiAccountData",
    },
  },
};

let api = null;

export async function getHydrationApi() {
  if (api) {
    return api;
  }

  const { endpoints } = getChainSettings(Chains.hydradx);
  const hydrationEndpoints = endpoints?.map((item) => item.url);
  if (!hydrationEndpoints) {
    throw new Error("Hydration endpoints not found");
  }

  api = await getChainApi(hydrationEndpoints);
  api.registry.register(runtimeApiTypes);
  api.registry.register(runtimeApiMethods);

  return api;
}
