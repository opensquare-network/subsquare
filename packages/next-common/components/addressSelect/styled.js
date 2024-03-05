import styled, { css } from "styled-components";
import Flex from "next-common/components/styled/flex";
import Relative from "next-common/components/styled/relative";

export const Wrapper = Relative;

export const Select = styled(Flex)`
  background: var(--neutral100);
  border: 1px solid var(--neutral400);
  border-radius: 8px;
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  > img:last-child {
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    margin-left: auto;
  }
  ${(props) =>
    props.disabled &&
    css`
      background: var(--neutral200);
      pointer-events: none;
    `};
`;

export const NameWrapper = styled.div`
  color: var(--textPrimary);
  flex-grow: 1;
  > :first-child {
    font-size: 14px;
    font-weight: 500;
  }
  > :last-child {
    margin-top: 4px;
    font-size: 12px;
    color: var(--textTertiary);
  }
`;

export const Options = styled.div`
  position: absolute;
  width: 100%;
  margin-top: 4px;
  padding: 8px 0;
  background: var(--neutral100);
  box-shadow: var(--shadow200);
  border: 1px solid var(--neutral300);
  border-radius: 8px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1;
`;

export const Item = styled(Flex)`
  background: var(--neutral100);
  height: 56px;
  padding: 0 16px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 16px;
  }
  > img:first-child {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
  }
  :hover {
    background: var(--neutral200);
  }
  ${(props) =>
    props?.theme.isDark &&
    css`
      :hover,
      :hover div {
        background: var(--neutral300);
      }
    `};
  ${(p) =>
    p.selected &&
    css`
      background: var(--neutral200);
    `}
`;
