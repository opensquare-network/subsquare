import { useThemeSetting } from "next-common/context/theme";
import { formatDays, formatHours } from "next-common/utils/timeFormat";
import { find, merge } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  abbreviateBigNumber,
  getEffectiveNumbers,
} from "next-common/utils/viewfuncs";

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

function getDetailConfigWithVotesData(
  labels,
  commonPluginsConfig,
  tooltipCallbacks,
  chainSettings,
) {
  const config = getDetailConfig(labels, commonPluginsConfig, tooltipCallbacks);
  return merge(config, getVotesScaleOptions(chainSettings));
}

const getNanValueShow = (value) =>
  !value ? "--" : `${Number(value).toFixed(2)}%`;

function handleTooltipLabel(tooltipItem, labelType, datasets) {
  const { parsed, dataIndex } = tooltipItem;
  const threshold = Number(parsed.y).toFixed(2);
  const dataset = datasets.find(
    (dataset) => dataset.label === `Current ${labelType}`,
  );
  if (dataset) {
    return `${labelType}: ${getNanValueShow(
      (dataset.data || [])[dataIndex],
    )} / ${threshold}%`;
  }
  return null;
}

function handleVoteTooltipLabel(tooltipItem, labelType, chainSettings) {
  const { decimals, symbol } = chainSettings;
  const { dataIndex, dataset } = tooltipItem;

  let value = toPrecision(dataset.data[dataIndex], decimals);
  if (Number(value) > 100000 || getEffectiveNumbers(value)?.length >= 11) {
    value = `≈ ${abbreviateBigNumber(value, 2)}`;
  }

  return `${labelType}: ${value} ${symbol}`;
}

export default function useDetailPageOptions(labels = [], datasets) {
  const chainSettings = useChainSettings();
  const commonPluginsConfig = useCommonPluginsConfig();
  return getDetailConfigWithVotesData(
    labels,
    commonPluginsConfig,
    {
      label(tooltipItem) {
        const { dataset } = tooltipItem;

        if (dataset.label === "Approval") {
          return handleTooltipLabel(tooltipItem, "Approval", datasets);
        } else if (dataset.label === "Support") {
          return handleTooltipLabel(tooltipItem, "Support", datasets);
        }
        return null;
      },
      afterBody(context) {
        const nayTooltipItem = find(context, { dataset: { label: "Nay" } });
        const ayeTooltipItem = find(context, { dataset: { label: "Aye" } });

        return [
          ayeTooltipItem &&
            handleVoteTooltipLabel(ayeTooltipItem, "Aye", chainSettings),
          nayTooltipItem &&
            handleVoteTooltipLabel(nayTooltipItem, "Nay", chainSettings),
        ].filter(Boolean);
      },
    },
    chainSettings,
  );
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
