import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;

  width: 150px;
  height: 4px;

  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div`
  display: flex;
  height: 100%;
  width: ${p => p.percent}%;
  background: ${p => p.color};
`;

export default function PercentageBar({ percent, colorLeft, colorRight }) {
  return (
    <Wrapper>
      <Bar percent={percent} color={colorLeft} />
      <Bar percent={100 - percent} color={colorRight} />
    </Wrapper>
  );
}
