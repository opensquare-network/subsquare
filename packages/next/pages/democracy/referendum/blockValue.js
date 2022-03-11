import SwitchableTime from "next-common/components/time/switchableTime";
import styled from "styled-components";

const Wrapper = styled.span`
  & > span {
    margin-left: 16px;
  }
`;

export default function BlockValue({ height, time, isEstimated = false }) {
  if (!time) {
    return <Wrapper>{height}</Wrapper>;
  }

  return (
    <Wrapper>
      {height}
      <SwitchableTime timestamp={time} isEstimated={isEstimated} />
    </Wrapper>
  );
}
