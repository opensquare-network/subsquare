import { cn } from "next-common/utils";
import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";

function Statistics({ className = "" }) {
  function createGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, "rgba(255, 0, 125, 0.1)");
    gradient.addColorStop(1, "rgba(255, 0, 125, 0.2)");
    return gradient;
  }

  const data = {
    labels: Array(11).fill(""),
    datasets: [
      {
        data: [100, 100, 100, 100],
        fill: true,
        backgroundColor(context) {
          const chart = context.chart;
          const { ctx } = chart;
          return createGradient(ctx);
        },
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        hoverBorderWidth: 0,
        pointHitRadius: 0,
      },
      {
        data: [null, null, 100, 80, 60, 40, 30, 20, 15, 15, 2],
        borderColor: "rgb(255, 0, 125)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgb(255, 0, 125)",
        pointBorderColor: "rgb(255, 0, 125)",
        pointBorderWidth: 0,
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgb(255, 0, 125)",
        pointHoverBorderColor: "rgb(255, 0, 125)",
        pointHoverBorderWidth: 0,
        pointHitRadius: 10,
      },
    ],
  };

  const options = {
    clip: false,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        filter(tooltipItem) {
          return tooltipItem.datasetIndex === 1;
        },
        displayColors: false,
        callbacks: {
          label(context) {
            return `${context.parsed.y}%`;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: "line",
            xMin: 2,
            xMax: 2,
            borderColor: "rgba(255, 0, 125, 0.5)",
            borderWidth: 1,
            borderDash: [5, 5],
            drawTime: "beforeDatasetsDraw",
          },
        },
      },
    },
  };

  return (
    <div className={cn("w-full", className)}>
      <Line options={options} data={data} />
    </div>
  );
}

export default Statistics;
