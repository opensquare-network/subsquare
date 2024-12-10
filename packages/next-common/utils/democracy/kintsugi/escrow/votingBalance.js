import { decodeAddress } from "@polkadot/util-crypto";
import * as monetary from "@interlay/monetary-js";
import {
  getFinalizedBlockNumber,
  newMonetaryAmount,
} from "next-common/utils/democracy/kintsugi/escrow/utils";

export async function getAddressVotingBalance(api, address) {
  const publicKey = decodeAddress(address);

  const nowHeight = await getFinalizedBlockNumber(api);

  const rawBalance = await api.rpc.escrow.balanceAt(publicKey, nowHeight + 10);
  const balance = newMonetaryAmount(
    rawBalance.amount.toString(),
    monetary.VoteKintsugi,
  );
  return balance.toString();
}
