import { useMemo } from "react";
import { colors } from "../consts";
import { useThemeSetting } from "next-common/context/theme";
import BigNumber from "bignumber.js";

export default function useChartData({ dataItems, totalFiat }) {
  const { neutral100 } = useThemeSetting();

  const data = useMemo(() => {
    if (!dataItems?.length) {
      return null;
    }
    const itemColors = dataItems.map(
      (_, index) => colors[index % colors.length],
    );
    const itemNames = dataItems.map((item) => item.name);
    const itemNameAbbrs = dataItems.map((item) => item.name);
    const itemFiatAtFinals = dataItems.map((item) => item.totalPayoutFiatValue);
    const itemPercentages = dataItems.map(
      (item) =>
        BigNumber(item.totalPayoutFiatValue)
          .dividedBy(totalFiat)
          .multipliedBy(100)
          .toFixed(2) + "%",
    );

    return {
      labels: itemNames,
      datasets: [
        {
          data: itemFiatAtFinals,
          name: itemNames,
          nameAbbrs: itemNameAbbrs,
          backgroundColor: itemColors,
          borderColor: neutral100,
          borderWidth: 3,
          hoverBorderColor: neutral100,
          hoverBorderWidth: 3,
          borderRadius: 5,
          spacing: 0,
          percentage: itemPercentages,
        },
      ],
      rawData: dataItems,
    };
  }, [dataItems, totalFiat, neutral100]);

  return data;
}
