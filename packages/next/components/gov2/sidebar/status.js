// bulk of copies from "components/referenda/vote"

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import styled, { useTheme } from "styled-components";
import Progress from "next-common/components/progress";
import FlexBetween from "next-common/components/styled/flexBetween";
import { p_14_normal } from "next-common/styles/componentCss";

const Wrapper = styled.div``;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Status = styled.div`
  margin-top: 8px !important;
  width: 100%;
  line-height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  text-align: center;
`;

const DecidingStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryBlue500};
  background: ${(props) => props.theme.secondaryBlue100};
`;

const PositiveStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryGreen500};
  background: ${(props) => props.theme.secondaryGreen100};
`;

const ProgressInfo = styled(FlexBetween)`
  color: ${(p) => p.theme.textPrimary};
  ${p_14_normal};
`;
const ProgressGroup = styled.div``;

export default function Gov2Status({ detail = {} }) {
  const { secondaryGreen500, secondaryGreen100 } = useTheme();

  const isConfirming = true;

  return (
    <Wrapper>
      <SecondaryCardDetail>
        <Title>Status</Title>

        <div>
          <ProgressGroup>
            <Progress percentage={10} />
            <ProgressInfo>
              <p>Decision Period</p>
              <p>28 days</p>
            </ProgressInfo>
          </ProgressGroup>

          <ProgressGroup>
            <Progress
              percentage={10}
              offsetLeft={35}
              offsetRight={50}
              fg={secondaryGreen500}
              bg={secondaryGreen100}
            />
            <ProgressInfo>
              <p>Confirming Period</p>
              <p>4 days</p>
            </ProgressInfo>
          </ProgressGroup>
        </div>

        <div>
          {isConfirming ? (
            <PositiveStatus>Confirm</PositiveStatus>
          ) : (
            <DecidingStatus>Deciding</DecidingStatus>
          )}
        </div>
      </SecondaryCardDetail>
    </Wrapper>
  );
}
