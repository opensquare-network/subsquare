import BigNumber from "bignumber.js";

export default function calcTransferable(info, existentialDeposit) {
  const { free, frozen, reserved } = info;
  const frozenReserveDif = BigNumber(frozen).minus(reserved);
  const noZeroConsidered = BigNumber(free || 0).minus(BigNumber.max(frozenReserveDif, existentialDeposit)).toString();
  return BigNumber.max(noZeroConsidered, 0).toString();
}
