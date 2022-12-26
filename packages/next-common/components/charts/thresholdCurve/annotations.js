import { useTheme } from "styled-components";
import light from "../../styled/theme/light";
import dark from "../../styled/theme/dark";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "../../../context/post/gov2/threshold";

function percentageLineBase(threshold, borderColor) {
  return {
    type: "line",
    value: threshold * 100,
    pointStyle: false,
    fill: false,
    borderDash: [5, 3],
    borderColor,
    borderWidth: 1,
    pointRadius: 0,
    pointHoverRadius: 0,
    scaleID: "y",
  };
}

export function useSupportPercentageLine(supportPercentage) {
  return percentageLineBase(supportPercentage, light.primaryPurple300);
}
export function useApprovalPercentageLine(approvalPercentage) {
  return percentageLineBase(approvalPercentage, light.secondaryGreen300);
}

function outerPointBase(backgroundColor, borderColor, x, y) {
  return {
    type: "point",
    radius: 5,
    backgroundColor,
    borderColor,
    xValue: x,
    yValue: y,
  };
}
function innerPointBase(backgroundColor, x, y) {
  return {
    type: "point",
    radius: 2,
    backgroundColor,
    borderWidth: 0,
    xValue: x,
    yValue: y,
  };
}
export function useSupportPoints(x) {
  const { neutral } = useTheme();
  const y = useSupportThreshold();

  return [
    outerPointBase(neutral, dark.primaryDarkBlue, x, y * 100),
    innerPointBase(dark.primaryDarkBlue, x, y * 100),
  ];
}
export function useApprovalPoints(x) {
  const { neutral } = useTheme();
  const y = useApprovalThreshold();

  return [
    outerPointBase(neutral, light.secondaryGreen500, x, y * 100),
    innerPointBase(light.secondaryGreen500, x, y * 100),
  ];
}
