import React, { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import useDuration from "../../utils/hooks/useDuration";

const Wrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.textSecondary};
  }

  & > span {
    margin-right: 4px;
  }
`;

function SwitchableTime({
  timestamp = new Date().getTime(),
  showDuration = false,
  isEstimated = false,
}) {
  const [isDuration, setIsDuration] = useState(showDuration);

  const timeStr = dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
  const duration = useDuration(timestamp);

  return (
    <Wrapper onClick={() => setIsDuration(!isDuration)}>
      {isEstimated ? <span>≈</span> : null}
      {isDuration ? duration : timeStr}
    </Wrapper>
  );
}

export default SwitchableTime;
