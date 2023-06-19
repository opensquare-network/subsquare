import React, { useState } from "react";
import styled from "styled-components";
import useDuration from "../../utils/hooks/useDuration";
import formatTime from "../../utils/viewfuncs/formatDate";

const Wrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: var(--textTertiary);
  cursor: pointer;

  &:hover {
    color: var(--textSecondary);
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

  const timeStr = formatTime(timestamp);
  const duration = useDuration(timestamp);

  return (
    <Wrapper onClick={() => setIsDuration(!isDuration)}>
      {isEstimated ? <span>≈</span> : null}
      {isDuration ? duration : timeStr}
    </Wrapper>
  );
}

export default SwitchableTime;
