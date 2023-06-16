import React from "react";
import Flex from "../../../styled/flex";
import LegendItem from "../../legend/item";

export default function ThresholdCurvesGov2TrackSummaryLegend() {
  return (
    <Flex>
      <LegendItem color="var(--purple500)">Support</LegendItem>
      <LegendItem color="var(--secondaryGreen500)">Approval</LegendItem>
    </Flex>
  );
}
