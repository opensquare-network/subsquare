import React from "react";
import PopupOrigin from "../../popup/wrapper/Popup";
import { emptyFunction } from "next-common/utils";
import styled, { css } from "styled-components";
import { smcss } from "next-common/utils/responsive";
import "../globalConfig";
import ThresholdCurvesGov2TallyLegend from "./legend/gov2TallyLegend";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "../../../context/post/gov2/threshold";
import LearnGov2Link from "../../links/learnGov2Link";
import VStack from "../../styled/vStack";
import ThresholdSupportCard from "./thresholdCards/support";
import ThresholdApprovalCard from "./thresholdCards/approval";
import ReferendaCurveChart from "next-common/components/charts/thresholdCurve/referendaCurveChart";
import FellowshipCurveChart from "next-common/components/charts/thresholdCurve/fellowshipCurveChart";

const Popup = styled(PopupOrigin)`
  width: 480px;

  ${smcss(css`
    width: 100%;
  `)}
`;

function PopupChartContent({ isFellowship = false }) {
  if (!isFellowship) {
    return <ReferendaCurveChart />;
  } else {
    return <FellowshipCurveChart />;
  }
}

export default function ThresholdCurvesGov2TallyPopup({
  setShow = emptyFunction,
  supportPerbill = 0,
  supportPercentage = 0,
  approvalPercentage = 0,
  isFellowship = false,
}) {
  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();

  return (
    <Popup
      title="Threshold Curves"
      onClose={() => {
        setShow(false);
      }}
    >
      <PopupChartContent isFellowship={isFellowship} />
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
