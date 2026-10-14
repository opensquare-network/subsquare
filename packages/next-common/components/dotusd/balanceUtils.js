import { isNil } from "lodash-es";

/**
 * Every asset account carries a status: a `Liquid` one can send and receive, a `Frozen` one
 * cannot send, and a `Blocked` one can do neither (see `AccountStatus` in
 * `frame/assets/src/types.rs`). Only a liquid account can transfer, so anything else holds
 * nothing transferrable. An account without a status does not exist, and neither does one
 * that was reaped after moving everything out; both have nothing to move.
 */
export function isSpendable(status) {
  return isNil(status) || status === "Liquid";
}

/**
 * PAPI decodes `Assets.Account` as `{ balance, status, reason }`, with the status enum
 * flattened to `{ type }`. Assembly is kept pure so it is covered by tests, the same split
 * as the PSM data in psmUtils.
 */
export function readDotUsdAccount(account) {
  const status = account?.status?.type ?? null;
  const balance = BigInt(account?.balance ?? 0);

  return {
    balance,
    status,
    transferrable: isSpendable(status) ? balance : 0n,
  };
}
