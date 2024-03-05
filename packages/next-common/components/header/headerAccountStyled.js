import styled from "styled-components";
import Relative from "../styled/relative";
import Flex from "../styled/flex";

export const Wrapper = Relative;

export const Menu = styled.div`
  border-radius: 8px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px;
  z-index: 999999;
  background: var(--neutral100);
  border-width: 1px;
  border-style: solid;
  border-color: var(--neutral300);
  color: var(--textPrimary);
  box-shadow: var(--shadow200);
`;

export const Item = styled(Flex)`
  min-width: 160px;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  :hover {
    background: var(--neutral200);
  }
  color: var(--textPrimary);

  > :not(:first-child) {
    margin-left: 8px;
  }
`;
