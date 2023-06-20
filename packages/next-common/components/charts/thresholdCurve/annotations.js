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
  const { green300 } = useThemeSetting();
  return percentageLineBase(approvalPercentage, green300);
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
  const { neutral100, purple500 } = useThemeSetting();

  return [
    outerPointBase(neutral100, purple500, x, y),
    innerPointBase(purple500, x, y),
  ];
}
export function useApprovalPoints(x, y) {
  const { neutral100, green500 } = useThemeSetting();

  return [
    outerPointBase(neutral100, green500, x, y),
    innerPointBase(green500, x, y),
  ];
}
