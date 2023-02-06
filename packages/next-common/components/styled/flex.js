import styled, { css } from "styled-components";

const Flex = styled.div`
  display: flex;
  align-items: center;

  ${(p) =>
    p.gap &&
    css`
      gap: ${p.gap}px;
    `}
`;

export default Flex;
