import { useThemeSetting } from "next-common/context/theme";

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
