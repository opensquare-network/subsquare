import styled from "styled-components";

export const ItemWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin: 2px 0;
`;

export const ItemValue = styled.span`
  word-break: break-word;
`;

export const ItemLink = styled.span`
  color: var(--sapphire500);
  :hover {
    text-decoration: underline;
  }
`;
