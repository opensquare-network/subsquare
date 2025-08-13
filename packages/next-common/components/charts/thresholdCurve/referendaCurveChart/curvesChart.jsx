import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";
import {
  useApprovalThresholdDatasetConfig,
  useApprovalValueDatasetConfig,
  useSupportThresholdDatasetConfig,
  useSupportValueDatasetConfig,
} from "next-common/components/charts/thresholdCurve/utils/dataset";
import useHistoryTallyValueData from "next-common/components/charts/thresholdCurve/useHistoryTallyValueData";
import { Line } from "react-chartjs-2";
import hoverLinePlugin from "next-common/components/charts/plugins/hoverLine";
import useDetailPageOptions from "next-common/components/charts/thresholdCurve/utils/options";
import { set } from "lodash-es";
import useInnerPoints from "next-common/components/charts/thresholdCurve/hooks/useInnerPoints";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useRef, useState } from "react";
import CustomXTickLabels from "./curveChartCustomXTickLabels";
import ApprovalBubbleArea from "./approvalBubbleArea";
import CurveChartTooltip from "./curveChartTooltip";
import useChartOptionsWithTooltip from "./curveChartTooltip/useChartOptionsWithTooltip";
import LegendItem from "../../legend/item";
import { useOnchainData } from "next-common/context/post";
import useFetchReferendaTallyHistory from "next-common/utils/hooks/referenda/useFetchReferendaTallyHistory";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";
import AvatarSwitch from "../gov2TallyPopup/avatarSwitch";

export default function CurvesChart() {
  const { referendumIndex } = useOnchainData();
  useFetchReferendaTallyHistory(referendumIndex, true);

  const { width } = useWindowSize();
  const chartRef = useRef();
  const chartWrapper = useRef();
  const { labels, supportData, approvalData } = useReferendumCurveData();
  const supportCurveConfig = useSupportThresholdDatasetConfig(supportData);
  const approvalCurveConfig = useApprovalThresholdDatasetConfig(approvalData);
  const [tooltip, setTooltip] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    data: {},
  });

  const { historySupportData, historyApprovalData } =
    useHistoryTallyValueData();

  const supportHistoryConfig = useSupportValueDatasetConfig(historySupportData);
  const approvalHistoryConfig =
    useApprovalValueDatasetConfig(historyApprovalData);

  const datasets = [
    approvalCurveConfig,
    supportCurveConfig,
    approvalHistoryConfig,
    supportHistoryConfig,
  ].filter(Boolean);

  const chartData = { labels, datasets };
  const defaultOptions = useDetailPageOptions(labels, datasets);
  const options = useChartOptionsWithTooltip(defaultOptions, setTooltip);

  const { approvalInnerPoint, supportInnerPoint } = useInnerPoints(labels);
  set(
    options,
    "plugins.annotation.annotations.pointSupportInner",
    supportInnerPoint,
  );
  set(
    options,
    "plugins.annotation.annotations.pointApprovalInner",
    approvalInnerPoint,
  );
  const showVoteActions = useShowVoteActions();
  const [showAvatar, setShowAvatar] = useState(true);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-textPrimary text14Bold">Threshold Curves</span>
        <div className="flex items-center gap-4">
          {showVoteActions && (
            <AvatarSwitch value={showAvatar} onChange={setShowAvatar} />
          )}
        </div>
      </div>
      <div>
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
          <CurveChartTooltip container={chartWrapper.current} {...tooltip} />
          {chartRef.current && showAvatar && (
            <ApprovalBubbleArea
              scales={chartRef.current?.scales}
              chartArea={chartRef.current?.chartArea}
              historyApprovalData={historyApprovalData}
            />
          )}
        </div>
        <CustomXTickLabels
          chartArea={chartRef.current?.chartArea}
          labelsLength={labels.length}
        />
      </div>
      <div className="flex justify-center flex-wrap">
        <LegendItem color="var(--purple500)">Support</LegendItem>
        <LegendItem dashed color="var(--purple500)">
          Current Support
        </LegendItem>
        <LegendItem color="var(--green500)">Approval</LegendItem>
        <LegendItem dashed color="var(--green500)">
          Current Approval
        </LegendItem>
      </div>
    </>
  );
}
