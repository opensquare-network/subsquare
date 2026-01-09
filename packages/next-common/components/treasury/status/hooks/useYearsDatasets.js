import { isNil } from "lodash-es";
import { useMemo } from "react";
import { colors } from "next-common/components/treasury/projects/const";
import useYears from "./useYears";

const barThickness = 20;
const barGap = 8;
const padding = 12;

export function useYearsDatasets() {
  const { years, loading } = useYears();

  const datasets = useMemo(() => {
    if (isNil(years) || years.length === 0) {
      return null;
    }
    return {
      labels: years.map((yearData) => yearData.year),
      datasets: [
        {
          label: "Year Status",
          data: years.map((yearData) => yearData.totalFiatValueAtFinal),
          backgroundColor: colors[1],
          borderRadius: 5,
          borderSkipped: false,
          barThickness: barThickness,
          maxBarThickness: barThickness,
        },
      ],
    };
  }, [years]);

  const height = useMemo(() => {
    if (isNil(datasets)) {
      return padding * 2;
    }
    const yearCount = datasets?.labels?.length || 0;
    if (yearCount === 0) {
      return padding * 2;
    }
    return padding + (barThickness + barGap) * yearCount - barGap + padding;
  }, [datasets]);

  const summaryTotalFiat = useMemo(() => {
    if (isNil(years) || years.length === 0) {
      return 0;
    }
    return {
      totalFiat: years.reduce(
        (acc, yearData) => acc + yearData.totalFiatValueAtFinal,
        0,
      ),
    };
  }, [years]);

  return {
    loading,
    datasets,
    height,
    summaryTotalFiat,
  };
}
