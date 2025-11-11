import { useMemo } from "react";
import { usePageProps } from "next-common/context/page";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";

export default function useTimeScopeData() {
  const { burnChart, burnList } = usePageProps();

  const chartData = burnChart?.result || [];
  const earliestChartItem = chartData[chartData.length - 1];
  const latestChartItem = chartData[0];

  const startBlockTime = earliestChartItem?.timestamp;
  const endBlockTime = latestChartItem?.timestamp;

  const listItems = burnList?.items || [];
  const latestListItem = listItems[0];
  const earliestListItem = listItems[listItems.length - 1];

  const startBlockHeight = earliestListItem?.indexer?.blockHeight;
  const endBlockHeight = latestListItem?.indexer?.blockHeight;

  const valueText = useMemo(() => {
    if (!startBlockTime || !endBlockTime) {
      return "-";
    }

    const timeDiff =
      new Date(endBlockTime).getTime() - new Date(startBlockTime).getTime();

    return formatTimeDuration(timeDiff, {
      slice: 3,
      withUnitSpace: true,
      showMonths: true,
      showSeconds: false,
    });
  }, [startBlockTime, endBlockTime]);

  return {
    startBlockTime,
    endBlockTime,
    startBlockHeight,
    endBlockHeight,
    valueText,
  };
}
