import light from "../../styled/theme/light";

function createThresholdAnnotationBase(threshold, borderColor) {
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

export function createSupportThresholdAnnotation(threshold) {
  return createThresholdAnnotationBase(threshold, light.primaryPurple300);
}

export function createApprovalThresholdAnnotation(threshold) {
  return createThresholdAnnotationBase(threshold, light.secondaryGreen300);
}
