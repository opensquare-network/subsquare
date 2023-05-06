import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ReactDOMServer from "react-dom/server";
import MyTooltip from "./myTooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      enabled: false,
      external: (context) => {
        const { chart, tooltip } = context;
        let tooltipEl = document.getElementById("chartjs-tooltip");

        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.id = "chartjs-tooltip";
          tooltipEl.innerHTML = "<div></div>";
          document.body.appendChild(tooltipEl);
        }

        if (tooltip.opacity === 0) {
          tooltipEl.style.opacity = 0;
          return;
        }

        const htmlString = ReactDOMServer.renderToString(
          <MyTooltip context={context} />,
        );
        tooltipEl.innerHTML = htmlString;

        let positionX = 0;
        let positionY = 0;
        let currElm = chart.canvas;
        while (currElm) {
          positionX += currElm.offsetLeft;
          positionY += currElm.offsetTop;
          currElm = currElm.offsetParent;
        }

        tooltipEl.style.opacity = 1;
        tooltipEl.style.position = "absolute";
        tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
        tooltipEl.style.top = `${positionY + tooltip.caretY}px`;
        tooltipEl.style.pointerEvents = "none";
        tooltipEl.style.transform = "translate(-50%, 0)";
        tooltipEl.style.width = "max-content";
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 14,
        },
      },
    },
    y: {
      ticks: {
        font: {
          size: 14,
        },
      },
    },
  },
};

export default function BarChart({ data }) {
  return <Bar data={data} options={options} />;
}
