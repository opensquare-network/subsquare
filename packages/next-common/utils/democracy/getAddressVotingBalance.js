import { isKintsugiChain } from "../chain";
import { getAddressVotingBalance as getKintsugiAddressVotingBalance } from "./kintsugi/escrow/votingBalance";

async function getSystemAccountBalance(api, address) {
  const account = await api?.query.system?.account(address);
  const jsonAccount = account?.toJSON();
  return jsonAccount?.data?.free;
}

export async function getAddressVotingBalance(chain, api, address) {
  if (isKintsugiChain(chain)) {
    return await getKintsugiAddressVotingBalance(api, address);
  }
  return await getSystemAccountBalance(api, address);
}
