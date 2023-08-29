import React from "react";
import {
  ThresholdInfo,
  ThresholdInfoLabel,
  ThresholdInfoValue,
} from "./styled";
import VStack from "../../../styled/vStack";
import FlexBetweenCenter from "../../../styled/flexBetweenCenter";

export default function ThresholdApprovalCard({
  approvalThreshold,
  approvalPercentage,
}) {
  return (
    <ThresholdInfo
      className="grow w-full"
      positive={approvalThreshold < approvalPercentage}
    >
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
