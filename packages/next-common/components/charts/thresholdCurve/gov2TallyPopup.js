import React, { useEffect, useState } from "react";
import PopupOrigin from "../../popup/wrapper/Popup";
import { emptyFunction } from "next-common/utils";
import styled, { css } from "styled-components";
import { smcss } from "next-common/utils/responsive";
import ThresholdCurvesChart from ".";
import FlexCenter from "next-common/components/styled/flexCenter";
import ThresholdCurvesGov2TallyLegend from "./legend/gov2TallyLegend";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "../../../context/post/gov2/threshold";
import { GreyPanel } from "../../styled/containers/greyPanel";
import FlexBetweenCenter from "../../styled/flexBetweenCenter";
import { p_14_medium, p_14_normal } from "../../../styles/componentCss";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "../../../store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { extractTime } from "@polkadot/util";
import { useDecidingSince } from "../../../context/post/gov2/referendum";
import set from "lodash.set";
import {
  useApprovalInnerPoint,
  useApprovalOuterPoint,
  useApprovalThresholdLine,
  useSupportInnerPoint,
  useSupportOuterPoint,
  useSupportThresholdLine,
} from "./annotations";
import LearnGov2Link from "../../links/learnGov2Link";
import VStack from "../../styled/vStack";
import Percentage from "@subsquare/next/components/gov2/sidebar/tally/supportBar/percentage";

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

  ${(p) =>
    p.positive &&
    css`
      background-color: ${p.theme.secondaryGreen100};
      color: ${p.theme.secondaryGreen500};
    `}
`;
const ThresholdInfoLabel = styled.span`
  ${p_14_medium};
`;
const ThresholdInfoValue = styled.span`
  ${p_14_normal};
`;

export default function ThresholdCurvesGov2TallyPopup({
  setShow = emptyFunction,
  labels = [],
  supportData = [],
  approvalData = [],
  supportPerbill = 0,
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

  // normalize to threshold, divide 100
  const currentApprovalData = approvalData[currentHrs] / 100;
  const [supportPercentage, setSupportPercentage] = useState();
  useEffect(() => {
    if (supportPerbill) {
      setSupportPercentage(
        new BigNumber(supportPerbill).div(Math.pow(10, 9)).toNumber()
      );
    }
  }, [supportPerbill]);

  const supportThresholdLine = useSupportThresholdLine();
  const approvalThresholdLine = useApprovalThresholdLine();
  const supportOuterPoint = useSupportOuterPoint(
    currentHrs,
    supportData[currentHrs]
  );
  const supportInnerPoint = useSupportInnerPoint(
    currentHrs,
    supportData[currentHrs]
  );
  const approvalOuterPoint = useApprovalOuterPoint(
    currentHrs,
    approvalData[currentHrs]
  );
  const approvalInnerPoint = useApprovalInnerPoint(
    currentHrs,
    approvalData[currentHrs]
  );

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

      <FlexCenter>
        <ThresholdCurvesGov2TallyLegend />
      </FlexCenter>

      <VStack space={16}>
        <ThresholdInfo positive={currentApprovalData < approvalThreshold}>
          <VStack space={8}>
            <FlexBetweenCenter>
              <ThresholdInfoLabel>Current Approval</ThresholdInfoLabel>
              <ThresholdInfoValue>
                {(currentApprovalData * 100).toFixed(2)}%
              </ThresholdInfoValue>
            </FlexBetweenCenter>
            <FlexBetweenCenter>
              <ThresholdInfoLabel>Threshold</ThresholdInfoLabel>
              <ThresholdInfoValue>
                {(approvalThreshold * 100).toFixed(2)}%
              </ThresholdInfoValue>
            </FlexBetweenCenter>
          </VStack>
        </ThresholdInfo>

        <ThresholdInfo positive={supportPercentage < supportThreshold}>
          <VStack space={8}>
            <FlexBetweenCenter>
              <ThresholdInfoLabel>Current Support</ThresholdInfoLabel>
              <ThresholdInfoValue>
                <Percentage perbill={supportPerbill} />
              </ThresholdInfoValue>
            </FlexBetweenCenter>
            <FlexBetweenCenter>
              <ThresholdInfoLabel>Threshold</ThresholdInfoLabel>
              <ThresholdInfoValue>
                {(supportThreshold * 100).toFixed(2)}%
              </ThresholdInfoValue>
            </FlexBetweenCenter>
          </VStack>
        </ThresholdInfo>

        <LearnGov2Link />
      </VStack>
    </Popup>
  );
}
