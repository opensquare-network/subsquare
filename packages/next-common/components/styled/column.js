import styled, { css } from "styled-components";

const Column = styled.div`
  display: flex;
  flex-direction: column;
  ${(p) =>
    p.gap &&
    css`
      > :not(:first-child) {
        margin-top: ${(p) => p.gap || 0}px;
      }
    `}
`;

export default Column;
