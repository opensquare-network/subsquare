import { Tooltip } from "chart.js";
import Chart from "chart.js/auto";
import Annotation from "chartjs-plugin-annotation";
import gradient from "chartjs-plugin-gradient";
import "./adapterDayjs";

Chart.defaults.font.family =
  "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

Chart.register(gradient);
Chart.register(Annotation);

Tooltip.positioners.followMouse = function (elements, eventPosition) {
  const pos = Tooltip.positioners.average(elements);

  if (pos === false) {
    return false;
  }

  return {
    x: eventPosition.x,
    y: pos.y,
  };
};
