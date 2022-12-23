import { useTheme } from "styled-components";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "../../../context/post/gov2/threshold";
import light from "../../styled/theme/light";
import dark from "../../styled/theme/dark";

function thresholdLineBase(threshold, borderColor) {
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

export function useSupportThresholdLine() {
  const supportThreshold = useSupportThreshold();
  return thresholdLineBase(supportThreshold, light.primaryPurple300);
}
export function useApprovalThresholdLine() {
  const approvalThreshold = useApprovalThreshold();
  return thresholdLineBase(approvalThreshold, light.secondaryGreen300);
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
export function useSupportOuterPoint(x, y) {
  const { neutral } = useTheme();
  return outerPointBase(neutral, dark.primaryDarkBlue, x, y);
}
export function useSupportInnerPoint(x, y) {
  return innerPointBase(dark.primaryDarkBlue, x, y);
}
export function useApprovalOuterPoint(x, y) {
  const { neutral } = useTheme();
  return outerPointBase(neutral, light.secondaryGreen500, x, y);
}
export function useApprovalInnerPoint(x, y) {
  return innerPointBase(light.secondaryGreen500, x, y);
}
