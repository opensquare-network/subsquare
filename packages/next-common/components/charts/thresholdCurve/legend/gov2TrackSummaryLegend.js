import React from "react";
import Flex from "../../../styled/flex";
import light from "../../../styled/theme/light";
import dark from "../../../styled/theme/dark";
import LegendItem from "../../legend/item";

export default function ThresholdCurvesGov2TrackSummaryLegend() {
  return (
    <Flex>
      <LegendItem color={dark.primaryDarkBlue}>Support</LegendItem>
      <LegendItem color={light.secondaryGreen500}>Approval</LegendItem>
    </Flex>
  );
}
