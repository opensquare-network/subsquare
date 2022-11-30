import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  border-radius: 4px;
  height: 8px;
  overflow: hidden;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
  overflow: hidden;
`;

const Background = styled(Bar)`
  background-color: ${(p) => p.theme.grey100Bg};
`;

const Percentage = styled(Bar)`
  background-color: ${(p) => p.fg ?? p.theme.secondaryBlue500};
  width: ${(p) => p.percentage}%;
`;
const Total = styled(Bar)`
  background-color: ${(p) => p.bg ?? p.theme.secondaryBlue100};
  left: ${(p) => p.start || 0}%;
  width: ${(p) => p.percentage}%;
  overflow: hidden;
`;

export default function Progress({ percentage = 0, start = 0, fg, bg }) {
  return (
    <Wrapper>
      <Background />
      <Total bg={bg} start={start}>
        <Percentage fg={fg} percentage={percentage} start={start} />
      </Total>
    </Wrapper>
  );
}
