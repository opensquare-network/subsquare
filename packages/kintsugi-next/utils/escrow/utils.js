const monetary = require("@interlay/monetary-js");

async function getFinalizedBlockNumber(api) {
  const head = await api.rpc.chain.getFinalizedHead();
  return (await api.query.system.number.at(head)).toNumber();
}

function parseEscrowPoint(e) {
  return {
    bias: e.bias.toBn(),
    slope: e.slope.toBn(),
    ts: e.ts.toBn()
  };
}

function newMonetaryAmount(
  amount,
  currency,
  base = false
) {
  const unit = base ? currency.base : currency.rawBase;
  return new monetary.MonetaryAmount(currency, amount, unit);
}

module.exports = {
  getFinalizedBlockNumber,
  parseEscrowPoint,
  newMonetaryAmount,
}
