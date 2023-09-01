import { useThemeSetting } from "next-common/context/theme";
import { formatDays, formatHours } from "next-common/utils/timeFormat";
import { emptyFunction } from "next-common/utils";

const commonConfig = {
  clip: false,
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
  layout: {
    padding: 2,
  },
};

function getScaleOptions(maxTicks, scalesX = true, scalesY = true) {
  return {
    scales: {
      x: {
        type: "linear",
        display: scalesX,
        ticks: {
          max: maxTicks,
          stepSize: Math.round(maxTicks / 3),
          callback(val) {
            return val + "hs";
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: scalesY,
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          callback(val) {
            return val + "%";
          },
        },
      },
    },
  };
}

function useCommonPluginsConfig() {
  const { neutral400 } = useThemeSetting();
  return {
    legend: {
      display: false,
    },
    hoverLine: {
      lineColor: neutral400,
      lineWidth: 1,
    },
  };
}

export function title(values) {
  const { label: hs } = values[0];
  const days = Math.floor(hs / 24);
  const restHs = hs - days * 24;
  let result = `Time: ${formatHours(hs)}`;
  if (days > 0) {
    result += ` (${formatDays(days)} ${restHs > 0 ? formatHours(restHs) : ""})`;
  }
  return result;
}

function getDetailConfig(labels, commonPluginsConfig, labelFunc) {
  return {
    ...commonConfig,
    ...getScaleOptions(labels.length, true, true),
    plugins: {
      ...commonPluginsConfig,
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        callbacks: {
          title,
          label: labelFunc,
        },
      },
    },
  };
}

function getNanValueShow(value) {
  if (!value) {
    return "--";
  }

  return `${Number(value).toFixed(2)}%`;
}

export default function useDetailPageOptions(labels = [], datasets) {
  const commonPluginsConfig = useCommonPluginsConfig();
  return getDetailConfig(labels, commonPluginsConfig, function (tooltipItem) {
    const { dataset, parsed, dataIndex } = tooltipItem;
    if (dataset.label === "Approval") {
      const threshold = Number(parsed.y).toFixed(2);
      const dataset = datasets.find(
        (dataset) => dataset.label === "Current Approval",
      );

      return `Approval: ${getNanValueShow(
        dataset.data[dataIndex],
      )} / ${threshold}%`;
    } else if (dataset.label === "Support") {
      const threshold = Number(parsed.y).toFixed(2);
      const dataset = datasets.find(
        (dataset) => dataset.label === "Current Support",
      );

      return `Support: ${getNanValueShow(
        dataset.data[dataIndex],
      )} / ${threshold}%`;
    }

    return null;
  });
}

export function useDetailPageOptionsWithoutTallyHistory(labels = []) {
  const commonPluginsConfig = useCommonPluginsConfig();
  return getDetailConfig(labels, commonPluginsConfig, function (tooltipItem) {
    const { dataset, parsed } = tooltipItem;
    if (dataset.label === "Approval") {
      const approvalValue = Number(parsed.y).toFixed(2);
      return `Approval: ${approvalValue}%`;
    } else if (dataset.label === "Support") {
      const supportValue = Number(parsed.y).toFixed(2);
      return `Support: ${supportValue}%`;
    }
    return null;
  });
}

export function useCurveChartOptions(labels = [], labelFunc = emptyFunction) {
  const commonPluginsConfig = useCommonPluginsConfig();
  return getDetailConfig(labels, commonPluginsConfig, labelFunc);
}
