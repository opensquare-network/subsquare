import React from "react";
import LegendItem from "../../legend/item";
import FlexCenter from "../../../styled/flexCenter";

export default function ThresholdCurvesGov2TallyLegend() {
  return (
    <FlexCenter>
      <LegendItem color="var(--purple500)">Support</LegendItem>
      <LegendItem dashed color="var(--purple300)">
        Current Support
      </LegendItem>
      <LegendItem color="var(--secondaryGreen500)">Approval</LegendItem>
      <LegendItem dashed color="var(--secondaryGreen300)">
        Current Approval
      </LegendItem>
    </FlexCenter>
  );
}
