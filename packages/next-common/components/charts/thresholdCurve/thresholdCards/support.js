import React, { useEffect, useState } from "react";
import {
  ThresholdInfo,
  ThresholdInfoLabel,
  ThresholdInfoValue,
} from "./styled";
import VStack from "../../../styled/vStack";
import FlexBetweenCenter from "../../../styled/flexBetweenCenter";
import Percentage from "../../../referenda/tally/support/percentage";

export default function ThresholdSupportCard({
  supportThreshold,
  supportPerbill,
  supportPercentage,
}) {
  const [threshold, setThreshold] = useState();
  useEffect(() => {
    if (supportThreshold) {
      setThreshold(supportThreshold * Math.pow(10, 9));
    }
  }, [supportThreshold]);

  return (
    <ThresholdInfo
      className="grow w-full"
      positive={supportThreshold < supportPercentage}
    >
      <VStack space={8}>
        <FlexBetweenCenter>
          <ThresholdInfoLabel>Current Support</ThresholdInfoLabel>
          <ThresholdInfoValue>
            <Percentage perbill={supportPerbill} />
          </ThresholdInfoValue>
        </FlexBetweenCenter>

        <FlexBetweenCenter>
          <ThresholdInfoLabel>Threshold</ThresholdInfoLabel>
          <ThresholdInfoValue>
            <Percentage perbill={threshold} />
          </ThresholdInfoValue>
        </FlexBetweenCenter>
      </VStack>
    </ThresholdInfo>
  );
}
