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
import Grid from "../../styled/grid";
import { GreyPanel } from "../../styled/containers/greyPanel";
import FlexBetweenCenter from "../../styled/flexBetweenCenter";
import { p_14_medium } from "../../../styles/componentCss";

const Popup = styled(PopupOrigin)`
  width: 480px;

  ${smcss(css`
    width: 100%;
  `)}
`;

const ThresholdInfo = styled(GreyPanel)`
  display: block;
  padding: 10px 16px;
  color: ${(p) => p.theme.textPrimary};
  ${p_14_medium};
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

      <Grid gap={16}>
        <ThresholdInfo>
          <Grid gap={8}>
            <FlexBetweenCenter>
              <span>Current Approval</span>
              <span>TODO</span>
            </FlexBetweenCenter>
            <FlexBetweenCenter>
              <span>Threshold</span>
              <span>{(approvalThreshold * 100).toFixed(1)}%</span>
            </FlexBetweenCenter>
          </Grid>
        </ThresholdInfo>

        <ThresholdInfo>
          <Grid gap={8}>
            <FlexBetweenCenter>
              <span>Current Support</span>
              <span>TODO</span>
            </FlexBetweenCenter>
            <FlexBetweenCenter>
              <span>Threshold</span>
              <span>{(supportThreshold * 100).toFixed(1)}%</span>
            </FlexBetweenCenter>
          </Grid>
        </ThresholdInfo>
      </Grid>
    </Popup>
  );
}
