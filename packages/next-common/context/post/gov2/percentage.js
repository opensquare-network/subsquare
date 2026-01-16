import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { useMemo } from "react";

export function useApprovalPercentage(tally) {
  return useMemo(() => {
    if (!tally || isNil(tally.ayes) || isNil(tally.nays)) {
      return;
    }

    const nTotal = new BigNumber(tally.ayes).plus(tally.nays);

    if (nTotal.eq(0)) {
      return 0;
    }

    return new BigNumber(tally.ayes).div(nTotal).toNumber();
  }, [tally]);
}

export function useSupportPercentage(supportPerbill) {
  return useMemo(() => {
    if (supportPerbill) {
      return new BigNumber(supportPerbill).div(Math.pow(10, 9)).toNumber();
    }
  }, [supportPerbill]);
}
