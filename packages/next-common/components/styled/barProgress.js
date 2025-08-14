import styled, { css } from "styled-components";

export const BarWrapper = styled.div`
  position: relative;
  padding: 8px 0;
  width: 100%;
`;

export const BarContainer = styled.div`
  display: flex;
  gap: ${(p) => p.gap}px;
  height: ${(p) => p.$height || 8}px;
  ${(p) =>
    p.thin &&
    css`
      height: 4px;
    `}
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

export const AyesBar = styled.div`
  background-color: var(--green500);
  width: ${(p) => p.precent}%;
  height: 100%;
`;

export const NaysBar = styled.div`
  background-color: var(--red500);
  width: ${(p) => p.precent}%;
  height: 100%;
`;

export const Abstain = styled.div`
  background-color: var(--neutral500);
  width: ${(p) => p.precent}%;
  height: 100%;
`;
