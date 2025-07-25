import { useThemeSetting } from "next-common/context/theme";
import { formatDays, formatHours } from "next-common/utils/timeFormat";
import { find, merge } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import {
  abbreviateBigNumber,
  getEffectiveNumbers,
} from "next-common/utils/viewfuncs";
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

const getNanValueShow = (value) =>
  !value ? "--" : `${Number(value).toFixed(2)}%`;

function handleTooltipLabel(label, itemItem, currentItem) {
  return `${label}: ${getNanValueShow(
    currentItem?.parsed?.y,
  )} / ${getNanValueShow(itemItem?.parsed?.y)}%`;
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
  const decisionIndex = useDecisionIndex();
  const commonPluginsConfig = useCommonPluginsConfig();
  const { gray400 } = useThemeSetting();
  const dividerLine = decisionIndex
    ? {
        type: "line",
        xMin: decisionIndex,
        xMax: decisionIndex,
        yMin: 0,
        yMax: "max",
        borderColor: gray400,
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
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        callbacks: merge(
          {
            title: function title(values) {
              const { dataIndex: hs } = values[0];

              if (hs < decisionIndex) {
                return `Preparing Time: ${formatHours(hs)}`;
              }
              const x = hs - decisionIndex;

              const days = Math.floor(x / 24);
              const restHs = x - days * 24;
              let result = `Deciding Time: ${formatHours(x)}`;
              if (days > 0) {
                result += ` (${formatDays(days)} ${
                  restHs > 0 ? formatHours(restHs) : ""
                })`;
              }

              return result;
            },
          },
          {
            label() {
              return null;
            },
            afterBody(context) {
              const nayTooltipItem = find(context, {
                dataset: { label: "Nay" },
              });
              const ayeTooltipItem = find(context, {
                dataset: { label: "Aye" },
              });

              const supportTooltipItem = find(context, {
                dataset: { label: "Support" },
              });
              const currentSupportTooltipItem = find(context, {
                dataset: { label: "Current Support" },
              });

              const approvalTooltipItem = find(context, {
                dataset: { label: "Approval" },
              });
              const currentApprovalTooltipItem = find(context, {
                dataset: { label: "Current Approval" },
              });

              return [
                handleTooltipLabel(
                  "Support",
                  supportTooltipItem,
                  currentSupportTooltipItem,
                ),
                handleTooltipLabel(
                  "Approval",
                  approvalTooltipItem,
                  currentApprovalTooltipItem,
                ),
                ayeTooltipItem &&
                  handleVoteTooltipLabel(ayeTooltipItem, "Aye", chainSettings),
                nayTooltipItem &&
                  handleVoteTooltipLabel(nayTooltipItem, "Nay", chainSettings),
              ].filter(Boolean);
            },
          },
        ),
      },
    },
  };

  const ayeDataset = find(datasets, { label: "Aye" });
  const nayDataset = find(datasets, { label: "Nay" });
  const shouldShowVotesScale =
    ayeDataset?.data.length > 0 || nayDataset?.data.length > 0;

  if (shouldShowVotesScale) {
    config = merge(config, getVotesScaleOptions(chainSettings));
  }

  return config;
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
