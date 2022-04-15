import monetary from "@interlay/monetary-js";
import BN from "bn.js";

export async function getFinalizedBlockNumber(api) {
  const head = await api.rpc.chain.getFinalizedHead();
  return (await api.query.system.number.at(head)).toNumber();
}

export function parseEscrowPoint(e) {
  return {
    bias: e.bias.toBn(),
    slope: e.slope.toBn(),
    ts: e.ts.toBn()
  };
}

export function newMonetaryAmount(
  amount,
  currency,
  base = false
) {
  const unit = base ? currency.base : currency.rawBase;
  return new monetary.MonetaryAmount(currency, amount, unit);
}

export function saturatingSub(x, y) {
  return BN.max(x.sub(y), new BN(0));
}
