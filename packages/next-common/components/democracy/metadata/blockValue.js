import React from "react";
import styled from "styled-components";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import SwitchableTime from "../../time/switchableTime";

const Wrapper = styled.span`
  line-height: 140%;
  & > span {
    margin-left: 16px;
  }
`;

const VerticalWrapper = styled.div`
  line-height: 140%;
  display: flex;
  flex-direction: column;
`;

export default function BlockValue({ height, time, isEstimated = false }) {
  if (!time) {
    return <Wrapper>{height}</Wrapper>;
  }

  const windowSize = useWindowSize();
  const children = (
    <>
      {height}
      <SwitchableTime timestamp={time} isEstimated={isEstimated} />
    </>
  );

  if (windowSize.width && windowSize.width <= 600) {
    return <VerticalWrapper>{children}</VerticalWrapper>;
  }

  return <Wrapper>{children}</Wrapper>;
}
