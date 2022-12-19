import styled from "styled-components";
import Flex from "../../styled/flex";

export const Row = styled(Flex)`
  height: 44px;
  margin-top: 0 !important;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 14px;
`;

export const BorderedRow = styled(Row)`
  border-bottom: 1px solid ${(props) => props.theme.grey200Border};
`;

export const Header = styled.span`
  width: 120px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};

  svg {
    margin-right: 8px;
  }
`;

export const Value = styled.span`
  color: ${(props) => props.theme.textPrimary};
`;
