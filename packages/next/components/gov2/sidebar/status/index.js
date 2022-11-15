import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled, { useTheme } from "styled-components";
import Progress from "next-common/components/progress";
import FlexBetween from "next-common/components/styled/flexBetween";
import { p_14_normal } from "next-common/styles/componentCss";
import TooltipOrigin from "next-common/components/tooltip";
import { useMemo } from "react";
import { gov2State } from "next-common/utils/consts/state";
import Status from "./status";
import { usePostState } from "next-common/context/post";
import {
  useConfirmTime,
  useDecisionTime,
} from "next-common/context/post/gov2/track";
import useDecisionPercentage, {
  useDecisionRemaining,
} from "./useDecisionPercentage";
import useConfirmPercentage, {
  useConfirmRemaining,
} from "./useConfirmPercentage";
import Remaining from "./remaining";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const ProgressInfo = styled(FlexBetween)`
  color: ${(p) => p.theme.textPrimary};
  ${p_14_normal};
`;
const ProgressGroup = styled.div``;

const Tooltip = styled(TooltipOrigin)`
  display: block;
`;

export default function Gov2Status() {
  const { secondaryGreen500, secondaryGreen300 } = useTheme();
  const state = usePostState();
  const decisionTime = useDecisionTime();
  const confirmTime = useConfirmTime();

  // same logic: `show confirming period`
  const isPositiveState = useMemo(
    () =>
      [gov2State.Confirming, gov2State.Approved, gov2State.Executed].includes(
        state
      ),
    [state]
  );

  const decisionRemaining = useDecisionRemaining();
  const confirmRemaining = useConfirmRemaining();
  const decisionPercentage = useDecisionPercentage();
  const confirmPercentage = useConfirmPercentage();

  return (
    <Wrapper>
      <SecondaryCardDetail>
        <Title>Status</Title>

        <div>
          <ProgressGroup>
            <Tooltip
              content={
                decisionRemaining > 0 && <Remaining ms={decisionRemaining} />
              }
            >
              <Progress percentage={decisionPercentage} />
            </Tooltip>
            <ProgressInfo>
              <p>Decision Period</p>
              <p>{decisionTime}</p>
            </ProgressInfo>
          </ProgressGroup>

          {isPositiveState && (
            <ProgressGroup>
              <Tooltip
                content={
                  confirmRemaining > 0 && <Remaining ms={confirmRemaining} />
                }
              >
                <Progress
                  percentage={confirmPercentage}
                  offsetLeft={50}
                  offsetRight={35}
                  fg={secondaryGreen500}
                  bg={secondaryGreen300}
                />
              </Tooltip>
              <ProgressInfo>
                <p>Confirming Period</p>
                <p>{confirmTime}</p>
              </ProgressInfo>
            </ProgressGroup>
          )}
        </div>

        <Status state={state} />
      </SecondaryCardDetail>
    </Wrapper>
  );
}
