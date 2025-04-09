import styled from "styled-components";

const Divider = styled.div`
  height: 1px;
  background: var(--neutral300);
  margin: ${(props) => props.margin}px 0;
`;

export default Divider;

export const VerticalDivider = styled.div`
  width: 1px;
  height: ${(props) => props.height || 0}px;
  background: var(--neutral300);
  margin: 0 ${(props) => props.margin || 0}px;
`;
