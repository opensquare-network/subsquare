import styled, { css } from "styled-components";

const Grid = styled.div`
  display: grid;

  ${(p) =>
    p.columns &&
    css`
      grid-template-columns: repeat(${p.columns}, minmax(0, 1fr));
    `}

  ${(p) =>
    p.rows &&
    css`
      grid-template-rows: repeat(${p.rows}, minmax(0, 1fr));
    `}

  ${(p) =>
    p.gap &&
    css`
      gap: ${p.gap}px;
    `}
`;

export default Grid;
