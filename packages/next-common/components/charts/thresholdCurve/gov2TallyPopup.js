import React from "react";
import PopupOrigin from "../../popup/wrapper/Popup";
import { emptyFunction } from "next-common/utils";
import styled, { css } from "styled-components";
import { smcss } from "next-common/utils/responsive";
import ThresholdCurvesChart from ".";
import FlexCenter from "next-common/components/styled/flexCenter";
import ThresholdCurvesLegend from "./legend";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "../../../context/post/gov2/threshold";

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
}) {
  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();

  return (
    <Popup
      title="Thoreshold Curves"
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
      />

      <FlexCenter>
        <ThresholdCurvesLegend />
      </FlexCenter>
    </Popup>
  );
}
