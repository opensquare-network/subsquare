import BigNumber from "bignumber.js";
import isNil from "lodash.isnil";
import { useEffect, useState } from "react";
import { useTally } from "../../../context/post/gov2/referendum";
import useSupportPerbill from "../../../utils/gov2/tally/useSupportPerbill";

export function useApprovalPercentage() {
  const tally = useTally();
  const [approvalPercentage, setApprovalPercentage] = useState();

  useEffect(() => {
    if (!tally || isNil(tally.ayes) || isNil(tally.nays)) {
      return;
    }

    const nTotal = new BigNumber(tally.ayes).plus(tally.nays);
    setApprovalPercentage(new BigNumber(tally.ayes).div(nTotal).toNumber());
  }, [tally]);

  return approvalPercentage;
}

export function useSupportPercentage() {
  const supportPerbill = useSupportPerbill();
  const [supportPercentage, setSupportPercentage] = useState();
  useEffect(() => {
    if (supportPerbill) {
      setSupportPercentage(
        new BigNumber(supportPerbill).div(Math.pow(10, 9)).toNumber()
      );
    }
  }, [supportPerbill]);

  return supportPercentage;
}
