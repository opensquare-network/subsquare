import { decodeAddress } from "@polkadot/util-crypto";
import monetary from "@interlay/monetary-js";
import BN from "bn.js";
import {
  getFinalizedBlockNumber,
  parseEscrowPoint,
  newMonetaryAmount,
  saturatingSub,
} from "./utils";

function rawBalanceAt(escrowPoint, height) {
  const heightDiff = saturatingSub(height, escrowPoint.ts);
  return saturatingSub(escrowPoint.bias, escrowPoint.slope.mul(heightDiff));
}

export async function getVotingBalance(api, address) {
  const publicKey = decodeAddress(address);

  const nowHeight = await getFinalizedBlockNumber(api);

  const userPointEpoch = await api.query.escrow.userPointEpoch(publicKey);
  const lastPoint = await api.query.escrow.userPointHistory(
    publicKey,
    userPointEpoch
  );
  const escrowPoint = parseEscrowPoint(lastPoint);
  const rawBalance = rawBalanceAt(escrowPoint, new BN(nowHeight));

  const balance = newMonetaryAmount(rawBalance, monetary.VoteKintsugi);
  return balance.toHuman();
}
