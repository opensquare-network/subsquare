import React from "react";
import Flex from "../../../styled/flex";
import light from "../../../styled/theme/light";
import dark from "../../../styled/theme/dark";
import Item from "./item";

export default function ThresholdCurvesGov2TrackSummaryLegend() {
  return (
    <Flex>
      <Item color={dark.primaryDarkBlue}>Support</Item>
      <Item color={light.secondaryGreen500}>Approval</Item>
    </Flex>
  );
}
