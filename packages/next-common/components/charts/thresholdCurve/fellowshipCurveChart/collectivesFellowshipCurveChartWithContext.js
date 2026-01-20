import React, { useRef, useMemo, useState } from "react";
import { useOnchainData } from "next-common/context/post";
import useFetchFellowshipReferendaTallyHistory from "next-common/utils/hooks/fellowship/useFetchFellowshipReferendaTallyHistory";
import { useFellowshipReferendaCurveChartDataWithHistory } from "./useFellowshipReferendaCurveChartData";
import useFellowshipCurveChartOptions from "./useFellowshipCurveChartOptions";
import useSlider from "../referendaCurveChart/useSlider";
import FellowshipApprovalBubbleArea from "./approvalBubbleArea";
import AvatarSwitch from "../gov2TallyPopup/avatarSwitch";
import { useWindowWidthContext } from "next-common/context/windowSize";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";

export default function CollectivesFellowshipCurveChartWithContext() {
  const { referendumIndex } = useOnchainData();
  useFetchFellowshipReferendaTallyHistory(referendumIndex);
  const [showVoter, setShowVoter] = useState(true);

  const width = useWindowWidthContext();
  const chartRef = useRef();
  const chartWrapper = useRef();

  const {
    labels,
    datasets,
    supportData,
    approvalData,
    historyApprovalData,
    totalHours,
  } = useFellowshipReferendaCurveChartDataWithHistory();

  const {
    rangeData,
    ranging,
    component: slider,
  } = useSlider(chartRef.current?.chartArea, false, totalHours || 0);

  const rangeLabel = labels.slice(rangeData[0], rangeData[1]);

  const rangeDatasets = useMemo(() => {
    return datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data?.slice(rangeData[0], rangeData[1]),
    }));
  }, [datasets, rangeData]);

  const options = useFellowshipCurveChartOptions(
    rangeLabel,
    supportData,
    approvalData,
  );

  const chartData = useMemo(
    () => ({ labels: rangeLabel, datasets: rangeDatasets }),
    [rangeLabel, rangeDatasets],
  );

  return (
    <div>
      <div className="flex items-center justify-end mb-2">
        <AvatarSwitch value={showVoter} onChange={setShowVoter} />
      </div>
      <div
        ref={chartWrapper}
        style={{ height: width <= 768 ? 144 : 320 }}
        className="relative"
      >
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
          plugins={[hoverLinePlugin]}
        />
        <FellowshipApprovalBubbleArea
          rangeData={rangeData}
          visible={showVoter && !ranging}
          chartArea={chartRef.current?.chartArea}
          historyApprovalData={historyApprovalData}
        />
      </div>
      {slider}
    </div>
  );
}
