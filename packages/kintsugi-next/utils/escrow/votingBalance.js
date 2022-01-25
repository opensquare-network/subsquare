const { decodeAddress } = require("@polkadot/util-crypto");
const monetary = require("@interlay/monetary-js");
const BN = require("bn.js");
const {
  getFinalizedBlockNumber,
  parseEscrowPoint,
  newMonetaryAmount,
  saturatingSub,
} = require("./utils");

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
