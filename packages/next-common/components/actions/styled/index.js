import styled, { css } from "styled-components";
import Flex from "../../styled/flex";
import { GreyPanel } from "../../styled/containers/greyPanel";

export const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
  height: 22px;
  color: var(--textSecondary);
`;

export const GreyWrapper = styled(GreyPanel)`
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  margin-top: 16px;
`;

export const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: var(--textSecondary);
  }
`;

export const Item = styled(Flex)`
  cursor: default;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;
      :hover {
        color: var(--textSecondary);
        > svg {
          path {
            fill: var(--textSecondary);
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: var(--textSecondary);
          > svg {
            path {
              fill: var(--textSecondary);
            }
          }
        `
      : css`
          color: var(--textTertiary);
          > svg {
            path {
              fill: var(--textTertiary);
            }
          }
        `}

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;

  :not(:first-child) {
    margin-left: 17px;
  }

  > svg {
    margin-right: 8px;
  }
`;
