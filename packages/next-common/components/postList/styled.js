import styled from "styled-components";

export const Index = styled.div`
  float: left;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  ::after {
    content: "·";
    font-size: 16px;
    line-height: 22.4px;
    color: var(--textTertiary);
    margin: 0 8px;
  }
`;
