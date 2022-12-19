import fetchInactive from "./inactive";
import getElectorate from "./index";
import BigNumber from "bignumber.js";

export default async function queryActiveBalance(api, height) {
  const allPromise = getElectorate(api, height);
  const inactivePromise = fetchInactive(api, height);
  const [all, inactive] = await Promise.all([allPromise, inactivePromise]);
  return new BigNumber(all).minus(inactive).toString();
}
