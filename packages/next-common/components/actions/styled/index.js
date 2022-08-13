import styled, { css } from "styled-components";
import Flex from "../../styled/flex";

export const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
  height: 22px;
  color: ${(props) => props.theme.textSecondary};
`;

export const GreyWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  margin-top: 16px;
`;

export const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: ${(props) => props.theme.textSecondary};
  }
`;

export const Item = styled(Flex)`
  cursor: default;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;
      :hover {
        color: ${(props) => props.theme.textSecondary};
        > svg {
          path {
            fill: ${(props) => props.theme.textSecondary};
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: ${(props) => props.theme.textSecondary};
          > svg {
            path {
              fill: ${(props) => props.theme.textSecondary};
            }
          }
        `
      : css`
          color: ${(props) => props.theme.textTertiary};
          > svg {
            path {
              fill: ${(props) => props.theme.textTertiary};
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
