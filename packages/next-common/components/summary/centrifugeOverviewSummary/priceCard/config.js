import { Chart } from "chart.js";
import "chart.js/auto";
import "./adapterDayjs";
import gradient from "chartjs-plugin-gradient";

Chart.defaults.font.family = "var(--font-inter)";

Chart.register(gradient);
