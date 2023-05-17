import React from "react";
import light from "../../../styled/theme/light";
import dark from "../../../styled/theme/dark";
import LegendItem from "../../legend/item";
import FlexCenter from "../../../styled/flexCenter";

export default function ThresholdCurvesGov2TallyLegend() {
  return (
    <FlexCenter>
      <LegendItem color={dark.primaryDarkBlue}>Support</LegendItem>
      <LegendItem dashed color={light.primaryPurple300}>
        Current Support
      </LegendItem>
      <LegendItem color={light.secondaryGreen500}>Approval</LegendItem>
      <LegendItem dashed color={light.secondaryGreen300}>
        Current Approval
      </LegendItem>
    </FlexCenter>
  );
}
