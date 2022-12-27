import styled from "styled-components";

const HStack = styled.div`
  display: flex;
  gap: ${(p) => p.space || 0}px;
`;

export default HStack;
