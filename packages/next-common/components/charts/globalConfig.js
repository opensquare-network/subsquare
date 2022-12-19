import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

Chart.defaults.font.family = "Inter";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);
