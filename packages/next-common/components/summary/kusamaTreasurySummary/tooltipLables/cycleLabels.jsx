import Tooltip from "next-common/components/tooltip";

export function ToBeAwardedLabel() {
  return (
    <>
      To be awarded
      <Tooltip content="Amount of approved proposals pending payout."></Tooltip>
    </>
  );
}

export function NextBurnLabel() {
  return (
    <>
      Next burn
      <Tooltip content="Unspent treasury funds at the end of the current cycle"></Tooltip>
    </>
  );
}

export function SpendPeriodLabel() {
  return (
    <>
      Spend period
      <Tooltip content="Duration of one treasury funding cycle."></Tooltip>
    </>
  );
}
