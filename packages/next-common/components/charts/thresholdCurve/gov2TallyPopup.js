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
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "../../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { extractTime } from "@polkadot/util";
import { useDecidingSince } from "../../../context/post/gov2/referendum";

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

  ${(p) =>
    p.positive &&
    css`
      background-color: ${p.theme.secondaryGreen100};
      color: ${p.theme.secondaryGreen500};
    `}
`;

export default function ThresholdCurvesGov2TallyPopup({
  setShow = emptyFunction,
  labels = [],
  supportData = [],
  approvalData = [],
}) {
  const blockTime = useSelector(blockTimeSelector);
  const latestHeight = useSelector(latestHeightSelector);

  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();

  const decisionSince = useDecidingSince();

  const gone = latestHeight - decisionSince;

  const value = new BigNumber(blockTime).multipliedBy(gone).toNumber();
  const { days, hours } = extractTime(value);
  const currentHrs = days * 24 + hours;
  // TODO: current time, add points

  // normalize to threshold, devide 100
  const currentApprovalData = approvalData[currentHrs] / 100;
  const currentSupportData = supportData[currentHrs] / 100;

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
        currentHrs={currentHrs}
      />

      <FlexCenter>
        <ThresholdCurvesLegend />
      </FlexCenter>

      <Grid gap={16}>
        <ThresholdInfo positive={currentApprovalData < approvalThreshold}>
          <Grid gap={8}>
            <FlexBetweenCenter>
              <span>Current Approval</span>
              <span>{(currentApprovalData * 100).toFixed(2)}%</span>
            </FlexBetweenCenter>
            <FlexBetweenCenter>
              <span>Threshold</span>
              <span>{(approvalThreshold * 100).toFixed(2)}%</span>
            </FlexBetweenCenter>
          </Grid>
        </ThresholdInfo>

        <ThresholdInfo positive={currentSupportData < supportThreshold}>
          <Grid gap={8}>
            <FlexBetweenCenter>
              <span>Current Support</span>
              <span>{(currentSupportData * 100).toFixed(2)}%</span>
            </FlexBetweenCenter>
            <FlexBetweenCenter>
              <span>Threshold</span>
              <span>{(supportThreshold * 100).toFixed(2)}%</span>
            </FlexBetweenCenter>
          </Grid>
        </ThresholdInfo>
      </Grid>
    </Popup>
  );
}
