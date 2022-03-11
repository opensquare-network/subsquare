import React, { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { timeDurationFromNow } from "../../utils";

const Wrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #9da9bb;
  cursor: pointer;

  &:hover {
    color: #506176;
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
  const duration = timeDurationFromNow(timestamp);

  return (
    <Wrapper onClick={() => setIsDuration(!isDuration)}>
      {isEstimated ? <span>≈</span> : null}
      {isDuration ? duration : timeStr}
    </Wrapper>
  );
}

export default SwitchableTime;
