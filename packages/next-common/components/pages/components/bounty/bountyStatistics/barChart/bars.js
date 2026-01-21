import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useBarChartOptions } from "./useBarChartOptions";

export default function Bars({ dataItems, totalFiat }) {
  const barOptions = useBarChartOptions();

  const data = useMemo(() => {
    return {
      labels: dataItems.map((item) => item.name || item.key),
      datasets: [
        {
          data: dataItems.map((item) => item.totalPayoutFiatValue),
          percentage: dataItems.map(
            (item) =>
              ((item.totalPayoutFiatValue / totalFiat) * 100).toFixed(2) + "%",
          ),
          backgroundColor: "#3B82F6",
        },
      ],
    };
  }, [dataItems, totalFiat]);

  return <Bar data={data} options={barOptions} />;
}
