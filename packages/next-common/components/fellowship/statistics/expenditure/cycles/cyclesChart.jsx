import React from "react";
import BarChart from "./barChart";
import { startCase } from "lodash-es";
import BigNumber from "bignumber.js";
import { getAbbreviateBigNumber } from "next-common/components/fellowship/statistics/common.js";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";

const amountFormat = {
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
};

function normalizeCycleAmount(value, cycle) {
  const { decimals } = getSalaryAsset("fellowship", cycle.indexer?.blockHeight);
  return new BigNumber(value || 0).shiftedBy(-decimals).toNumber();
}

function formatAxisAmount(value) {
  const amount = new BigNumber(value || 0);
  const abbreviations = [
    { value: new BigNumber("1000000000000000"), suffix: "Q" },
    { value: new BigNumber("1000000000000"), suffix: "T" },
    { value: new BigNumber("1000000000"), suffix: "B" },
    { value: new BigNumber("1000000"), suffix: "M" },
    { value: new BigNumber("1000"), suffix: "K" },
  ];
  const abbreviation = abbreviations.find((item) =>
    amount.isGreaterThanOrEqualTo(item.value),
  );

  if (!abbreviation) {
    return amount.toFormat(2, amountFormat);
  }

  return `${amount.dividedBy(abbreviation.value).toFormat(2, amountFormat)}${
    abbreviation.suffix
  }`;
}

function getTooltipTitle(item) {
  const tooltipItem = item[0];
  const { label = "" } = tooltipItem;
  return `Cycle ${label}`;
}

function getTooltipLabel(item, currentDataset) {
  const { dataset, datasetIndex } = item;
  const {
    registeredPaidCount,
    unRegisteredPaidCount,
    registeredPaid,
    unRegisteredPaid,
  } = currentDataset;
  const blockHeight = currentDataset.indexer?.blockHeight;
  const totalPaid = getAbbreviateBigNumber(
    new BigNumber(registeredPaid).plus(unRegisteredPaid),
    true,
    blockHeight,
  );
  if (datasetIndex === 0) {
    return [
      `Total: ${totalPaid}`,
      `${dataset.label}: ${getAbbreviateBigNumber(
        registeredPaid,
        true,
        blockHeight,
      )}`,
    ];
  }
  if (datasetIndex === 1) {
    return [
      `${dataset.label}: ${getAbbreviateBigNumber(
        unRegisteredPaid,
        true,
        blockHeight,
      )}`,
      `Registered Paid Count: ${registeredPaidCount}`,
      `Unregistered Paid Count: ${unRegisteredPaidCount}`,
    ];
  }
}

export default function CyclesChart({ values }) {
  const height = 180;
  const categoryPercentage = 0.6;
  const barPercentage = 1;

  const labels = values.map((value) => `# ${startCase(value.index)}`);
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Registered Paid",
      data: values.map((value) =>
        normalizeCycleAmount(value.registeredPaid, value),
      ),
      backgroundColor: "rgba(230, 0, 122, 1)",
      tooltip: true,
    },
    {
      categoryPercentage,
      barPercentage,
      label: "Unregistered Paid",
      data: values.map((value) =>
        normalizeCycleAmount(value.unRegisteredPaid, value),
      ),
      backgroundColor: "rgba(230, 0, 122, 0.4)",
      tooltip: true,
    },
  ];

  const data = {
    labels,
    datasets,
  };

  return (
    <BarChart
      height={height}
      data={data}
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              title: getTooltipTitle,
              label: (item) => {
                const currentDataset = values[item.dataIndex];
                return getTooltipLabel(item, currentDataset);
              },
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: formatAxisAmount,
            },
          },
        },
      }}
    />
  );
}
