import { useThemeSetting } from "next-common/context/theme";
import { formatDays, formatHours } from "next-common/utils/timeFormat";
import { find, merge } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";

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
        grid: {
          drawTicks: false,
        },
      },
    },
  };
}

function getVotesScaleOptions(chainSettings) {
  const { decimals } = chainSettings || {};

  return {
    scales: {
      y1: {
        stacked: true,
        position: "right",
        min: 0,
        grid: {
          display: false,
        },
        ticks: {
          callback(value) {
            return abbreviateBigNumber(toPrecision(value, decimals));
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

function getDetailConfig(labels, commonPluginsConfig, tooltipCallbacks) {
  return {
    ...commonConfig,
    ...getScaleOptions(labels.length, true, true),
    plugins: {
      ...commonPluginsConfig,
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        callbacks: merge(
          {
            title,
          },
          tooltipCallbacks,
        ),
      },
    },
  };
}

export default function useDetailPageOptions(labels = [], datasets) {
  const { neutral300 } = useThemeSetting();
  const chainSettings = useChainSettings();
  const decisionIndex = useDecisionIndex();
  const commonPluginsConfig = useCommonPluginsConfig();
  const dividerLine = decisionIndex
    ? {
        type: "line",
        xMin: decisionIndex,
        xMax: decisionIndex,
        yMin: 0,
        yMax: "max",
        borderColor: "#9ea9bb",
        borderWidth: 1,
        borderDash: [5, 5],
      }
    : null;

  let config = {
    ...commonConfig,
    ...getScaleOptions(labels.length, false, true),
    plugins: {
      annotation: {
        annotations: {
          dividerLine,
        },
      },
      ...commonPluginsConfig,
    },
  };

  const ayeDataset = find(datasets, { label: "Aye" });
  const nayDataset = find(datasets, { label: "Nay" });
  const shouldShowVotesScale =
    ayeDataset?.data.length > 0 || nayDataset?.data.length > 0;

  if (shouldShowVotesScale) {
    config = merge(config, getVotesScaleOptions(chainSettings));
  }

  return merge(config, {
    scales: {
      y: {
        grid: {
          color: neutral300,
        },
      },
    },
  });
}

export function useDetailPageOptionsWithoutTallyHistory(labels = []) {
  const commonPluginsConfig = useCommonPluginsConfig();
  return getDetailConfig(labels, commonPluginsConfig, {
    label(tooltipItem) {
      const { dataset, parsed } = tooltipItem;
      if (dataset.label === "Approval") {
        const approvalValue = Number(parsed.y).toFixed(2);
        return `Approval: ${approvalValue}%`;
      } else if (dataset.label === "Support") {
        const supportValue = Number(parsed.y).toFixed(2);
        return `Support: ${supportValue}%`;
      }
      return null;
    },
  });
}

export function useCurveChartOptions(labels = [], tooltipCallbacks = {}) {
  const commonPluginsConfig = useCommonPluginsConfig();
  return getDetailConfig(labels, commonPluginsConfig, tooltipCallbacks);
}
