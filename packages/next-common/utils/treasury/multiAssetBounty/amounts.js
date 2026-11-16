import BigNumber from "bignumber.js";

// Amounts of a multi-asset bounty account, all in the bounty asset.
//
// The pallet counts `value - ChildBountiesValuePerParent` as available for
// child bounties, while award and close only move the recorded value. Anything
// the account holds above that is unregistered and can only be registered with
// increase_value; left unregistered it stays on the account after the bounty
// leaves storage and no pallet call can move it.
export function getMultiAssetBountyAmounts({
  value,
  childBountiesValue,
  balance,
}) {
  const recordedValue = new BigNumber(value ?? 0);
  const childrenValue = new BigNumber(childBountiesValue ?? 0);
  const accountBalance = new BigNumber(balance ?? 0);
  const registeredAvailable = recordedValue.minus(childrenValue);

  return {
    value: recordedValue,
    balance: accountBalance,
    childBountiesValue: childrenValue,
    // fund_child_bounty is limited by both the recorded value and the funds
    // actually on the account.
    available: BigNumber.min(
      BigNumber.max(registeredAvailable, 0),
      accountBalance,
    ),
    unregistered: accountBalance.minus(registeredAvailable),
  };
}
