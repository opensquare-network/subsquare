import { cn } from "next-common/utils";
import { Line } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import { useThemeSetting } from "next-common/context/theme";
import { useCallback, useMemo } from "react";

const GROUP_SIZE = 100;
function createGroupedBlocks(blocks = 0) {
  return Math.ceil(blocks / GROUP_SIZE);
}

function Statistics({
  className = "",
  initBlockHeight,
  // eslint-disable-next-line no-unused-vars
  endBlockHeight,
  totalBlocks = 0,
  interludeEndHeight,
}) {
  const theme = useThemeSetting();
  const totalGroupedBlocks = createGroupedBlocks(totalBlocks || 0);
  const interludeBlocks = interludeEndHeight - initBlockHeight;

  const createGradient = useCallback(
    (ctx) => {
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      gradient.addColorStop(0, theme.theme100);
      gradient.addColorStop(1, theme.theme300);
      return gradient;
    },
    [theme],
  );

  const data = useMemo(() => {
    return {
      labels: Array(totalGroupedBlocks).fill(""),
      datasets: [
        {
          data: Array(0).fill(100),
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
          spanGaps: true,
        },
        // // renewal points
        // {
        //   data: [1, 45],
        //   showLine: false,
        //   pointRadius: 4,
        //   pointBackgroundColor: theme.theme300,
        //   pointBorderColor: theme.theme300,
        //   pointBorderWidth: 0,
        //   pointHoverRadius: 3,
        //   pointHoverBackgroundColor: theme.theme300,
        //   pointHoverBorderColor: theme.theme300,
        //   pointHoverBorderWidth: 0,
        //   pointHitRadius: 10,
        // },
        // // sale line
        // {
        //   data: [null, null, 100, 80, 60, 40, 30, 20, 15, 15, 2],
        //   borderColor: theme.theme500,
        //   borderWidth: 2,
        //   pointRadius: 4,
        //   pointBackgroundColor: theme.theme500,
        //   pointBorderColor: theme.theme500,
        //   pointBorderWidth: 0,
        //   pointHoverRadius: 3,
        //   pointHoverBackgroundColor: theme.theme500,
        //   pointHoverBorderColor: theme.theme500,
        //   pointHoverBorderWidth: 0,
        //   pointHitRadius: 10,
        // },
      ],
    };
  }, [createGradient, totalGroupedBlocks]);

  const options = {
    clip: false,
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    elements: {
      line: {
        tension: 0,
      },
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
        filter(tooltipItem) {
          return (
            tooltipItem.datasetIndex === 1 || tooltipItem.datasetIndex === 2
          );
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
            xMin: Math.ceil(interludeBlocks / GROUP_SIZE),
            xMax: Math.ceil(interludeBlocks / GROUP_SIZE),
            borderColor: theme.neutral500,
            borderWidth: 1,
            borderDash: [3, 3],
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
