import React from "react";
import BarChart from "./barChart";
import { startCase } from "lodash-es";
import BigNumber from "bignumber.js";
import { getAbbreviateBigNumber } from "next-common/components/fellowship/statistics/common.js";

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
  const totalPaid = getAbbreviateBigNumber(
    new BigNumber(registeredPaid).plus(unRegisteredPaid),
  );
  if (datasetIndex === 0) {
    return [
      `Total: ${totalPaid}`,
      `${dataset.label}: ${getAbbreviateBigNumber(registeredPaid)}`,
    ];
  }
  if (datasetIndex === 1) {
    return [
      `${dataset.label}: ${getAbbreviateBigNumber(unRegisteredPaid)}`,
      `Registered Paid Count: ${registeredPaidCount}`,
      `Unregistered Paid Count: ${unRegisteredPaidCount}`,
    ];
  }
}

export default function CyclesChart({ values }) {
  const height = (values.length + 1) * 30;
  const categoryPercentage = 0.6;
  const barPercentage = 1;

  const labels = values.map((value) => `# ${startCase(value.index)}`);
  const datasets = [
    {
      categoryPercentage,
      barPercentage,
      label: "Registered Paid",
      data: values.map((value) => value.registeredPaid),
      backgroundColor: "rgba(230, 0, 122, 1)",
      tooltip: true,
    },
    {
      categoryPercentage,
      barPercentage,
      label: "Unregistered Paid",
      data: values.map((value) => value.unRegisteredPaid),
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
      }}
    />
  );
}
