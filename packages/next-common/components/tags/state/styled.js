import styled from "styled-components";

const Common = styled.span`
  padding: 2px 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  border-radius: 4px;
  color: var(--textPrimaryContrast);
`;

export const StartTag = styled(Common)`
  background: var(--azure500);
`;

export const MotionTag = styled(Common)`
  background: var(--purple500);
`;

export const ActiveTag = styled(Common)`
  background: var(--blue500);
`;

export const PositiveTag = styled(Common)`
  background: var(--green500);
`;

export const NegativeTag = styled(Common)`
  background: var(--red500);
`;

export const ClosedTag = styled(Common)`
  background: var(--neutral500);
`;

export const BaseTag = Common;
