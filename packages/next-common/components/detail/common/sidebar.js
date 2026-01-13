import styled from "styled-components";

export const SideInfoItem = styled.div`
  display: flex;
  padding: 12px 0;
  :not(:last-child) {
    border-bottom: 1px solid var(--neutral300);
  }
  font-size: 14px;
  line-height: 20px;
  color: var(--textPrimary);
`;

export const SideInfoItemName = styled.div`
  font-weight: 500;
`;

export const SideInfoItemValue = styled.div`
  display: flex;
  justify-content: right;
  flex-grow: 1;

  > a {
    color: var(--sapphire500);
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;
