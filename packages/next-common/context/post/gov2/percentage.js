import BigNumber from "bignumber.js";
import isNil from "lodash.isnil";
import { useMemo } from "react";
import { useTally } from "../../../context/post/gov2/referendum";
import useSupportPerbill from "../../../utils/gov2/tally/useSupportPerbill";

export function useApprovalPercentage() {
  const tally = useTally();

  return useMemo(() => {
    if (!tally || isNil(tally.ayes) || isNil(tally.nays)) {
      return;
    }

    const nTotal = new BigNumber(tally.ayes).plus(tally.nays);
    return new BigNumber(tally.ayes).div(nTotal).toNumber();
  }, [tally]);
}

export function useSupportPercentage() {
  const supportPerbill = useSupportPerbill();

  return useMemo(() => {
    if (supportPerbill) {
      return new BigNumber(supportPerbill).div(Math.pow(10, 9)).toNumber();
    }
  }, [supportPerbill]);
}
