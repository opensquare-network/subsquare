import fetchInactive from "./inactive";
import getElectorate from "./index";
import BigNumber from "bignumber.js";

export default async function queryActiveBalance(api, height) {
  const all = await getElectorate(api, height);
  const inactive = await fetchInactive(api, height);

  console.log("all", all, "inactive", inactive);
  const active = new BigNumber(all).minus(inactive).toString();
  console.log("active", active);
  return active;
}
