import styled from "styled-components";

export const ItemWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin: 2px 0;
  word-break: break-all;
`;

export const ItemLink = styled.a`
  color: ${(p) => p.theme.secondaryBlue500};
  :hover {
    text-decoration: underline;
  }
`;
