import styled from "styled-components";

const Divider = styled.div`
  height: 1px;
  background: var(--neutral300);
  margin: ${(props) => props.margin}px 0;
`;

export default Divider;
