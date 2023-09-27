import { decodeAddress } from "@polkadot/util-crypto";
import {
  getFinalizedBlockNumber,
  newMonetaryAmount,
} from "next-common/utils/democracy/kintsugi/escrow/utils";
import * as monetary from "@interlay/monetary-js";

export default async function getKintsugiVotingBalance(api, address) {
  const publicKey = decodeAddress(address);

  const nowHeight = await getFinalizedBlockNumber(api);

  const rawBalance = await api.rpc.escrow.balanceAt(publicKey, nowHeight + 10);
  const balance = newMonetaryAmount(
    rawBalance.amount.toString(),
    monetary.VoteKintsugi,
  );
  return balance.toString();
}
