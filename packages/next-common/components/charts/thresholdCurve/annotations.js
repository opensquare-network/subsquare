import { useThemeSetting } from "next-common/context/theme";

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
  const { purple300 } = useThemeSetting();
  return percentageLineBase(supportPercentage, purple300);
}
export function useApprovalPercentageLine(approvalPercentage) {
  const { secondaryGreen300 } = useThemeSetting();
  return percentageLineBase(approvalPercentage, secondaryGreen300);
}

function outerPointBase(backgroundColor, borderColor, x, y) {
  return {
    type: "point",
    radius: 5,
    backgroundColor,
    borderColor,
    xValue: x,
    yValue: y * 100,
  };
}
function innerPointBase(backgroundColor, x, y) {
  return {
    type: "point",
    radius: 2,
    backgroundColor,
    borderWidth: 0,
    xValue: x,
    yValue: y * 100,
  };
}
export function useSupportPoints(x, y) {
  const { neutral, purple500 } = useThemeSetting();

  return [
    outerPointBase(neutral, purple500, x, y),
    innerPointBase(purple500, x, y),
  ];
}
export function useApprovalPoints(x, y) {
  const { neutral, secondaryGreen500 } = useThemeSetting();

  return [
    outerPointBase(neutral, secondaryGreen500, x, y),
    innerPointBase(secondaryGreen500, x, y),
  ];
}
