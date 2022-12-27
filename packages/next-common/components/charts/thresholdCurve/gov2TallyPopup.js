import React from "react";
import PopupOrigin from "../../popup/wrapper/Popup";
import { emptyFunction } from "next-common/utils";
import styled, { css } from "styled-components";
import { smcss } from "next-common/utils/responsive";
import ThresholdCurvesChart from ".";
import ThresholdCurvesGov2TallyLegend from "./legend/gov2TallyLegend";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "../../../context/post/gov2/threshold";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "../../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { useDecidingSince } from "../../../context/post/gov2/referendum";
import set from "lodash.set";
import {
  useApprovalPercentageLine,
  useApprovalPoints,
  usePointsLine,
  useSupportPercentageLine,
  useSupportPoints,
} from "./annotations";
import LearnGov2Link from "../../links/learnGov2Link";
import VStack from "../../styled/vStack";
import ThresholdSupportCard from "./thresholdCards/support";
import ThresholdApprovalCard from "./thresholdCards/approval";

const Popup = styled(PopupOrigin)`
  width: 480px;

  ${smcss(css`
    width: 100%;
  `)}
`;

export default function ThresholdCurvesGov2TallyPopup({
  setShow = emptyFunction,
  labels = [],
  supportData = [],
  approvalData = [],
  supportPerbill = 0,
  supportPercentage = 0,
  approvalPercentage = 0,
}) {
  const blockTime = useSelector(blockTimeSelector);
  const latestHeight = useSelector(latestHeightSelector);

  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();

  const decisionSince = useDecidingSince();

  const gone = latestHeight - decisionSince;

  const value = new BigNumber(blockTime).multipliedBy(gone).toNumber();
  // to second
  const v = value / 1000;
  const xValue = v / 3600;

  const supportThresholdLine = useSupportPercentageLine(supportPercentage);
  const approvalThresholdLine = useApprovalPercentageLine(approvalPercentage);
  const [supportOuterPoint, supportInnerPoint] = useSupportPoints(
    xValue,
    supportThreshold
  );
  const [approvalOuterPoint, approvalInnerPoint] = useApprovalPoints(
    xValue,
    approvalThreshold
  );

  const pointsLine = usePointsLine(xValue);

  function beforeDrawOptions(options) {
    set(
      options,
      "plugins.annotation.annotations.lineSupportThreshold",
      supportThresholdLine
    );
    set(
      options,
      "plugins.annotation.annotations.lineApprovalThreshold",
      approvalThresholdLine
    );

    set(
      options,
      "plugins.annotation.annotations.pointSupportOuter",
      supportOuterPoint
    );
    set(
      options,
      "plugins.annotation.annotations.pointSupportInner",
      supportInnerPoint
    );
    set(
      options,
      "plugins.annotation.annotations.pointApprovalOuter",
      approvalOuterPoint
    );
    set(
      options,
      "plugins.annotation.annotations.pointApprovalInner",
      approvalInnerPoint
    );
    set(options, "plugins.annotation.annotations.pointsLine", pointsLine);
  }

  return (
    <Popup
      title="Threshold Curves"
      onClose={() => {
        setShow(false);
      }}
    >
      <ThresholdCurvesChart
        height={144}
        labels={labels}
        supportData={supportData}
        approvalData={approvalData}
        supportThreshold={supportThreshold}
        approvalThreshold={approvalThreshold}
        beforeDrawOptions={beforeDrawOptions}
      />

      <ThresholdCurvesGov2TallyLegend />

      <VStack space={16}>
        <ThresholdApprovalCard
          approvalThreshold={approvalThreshold}
          approvalPercentage={approvalPercentage}
        />

        <ThresholdSupportCard
          supportThreshold={supportThreshold}
          supportPerbill={supportPerbill}
          supportPercentage={supportPercentage}
        />

        <LearnGov2Link />
      </VStack>
    </Popup>
  );
}
