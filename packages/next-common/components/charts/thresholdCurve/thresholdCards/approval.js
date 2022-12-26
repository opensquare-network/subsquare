import React, { useEffect, useState } from "react";
import { useTally } from "../../../../context/post/gov2/referendum";
import {
  ThresholdInfo,
  ThresholdInfoLabel,
  ThresholdInfoValue,
} from "./styled";
import VStack from "../../../styled/vStack";
import FlexBetweenCenter from "../../../styled/flexBetweenCenter";
import BigNumber from "bignumber.js";
import isNil from "lodash.isnil";

export default function ThresholdApprovalCard({ approvalThreshold }) {
  const tally = useTally();
  const [approvalPercentage, setApprovalPercentage] = useState();

  useEffect(() => {
    if (!tally || isNil(tally.ayes) || isNil(tally.nays)) {
      return;
    }

    const nTotal = new BigNumber(tally.ayes).plus(tally.nays);
    setApprovalPercentage(new BigNumber(tally.ayes).div(nTotal).toNumber());
  }, [tally]);

  return (
    <ThresholdInfo positive={approvalThreshold < approvalPercentage}>
      <VStack space={8}>
        <FlexBetweenCenter>
          <ThresholdInfoLabel>Current Approval</ThresholdInfoLabel>
          <ThresholdInfoValue>
            {(approvalPercentage * 100).toFixed(2)}%
          </ThresholdInfoValue>
        </FlexBetweenCenter>
        <FlexBetweenCenter>
          <ThresholdInfoLabel>Threshold</ThresholdInfoLabel>
          <ThresholdInfoValue>
            {(approvalThreshold * 100).toFixed(2)}%
          </ThresholdInfoValue>
        </FlexBetweenCenter>
      </VStack>
    </ThresholdInfo>
  );
}
