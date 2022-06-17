import React from "react";
import styled, { css } from "styled-components";
import TrashIcon from "next-common/assets/imgs/icons/delete.svg";
import {
  light_text_tertiary,
  light_text_secondary,
} from "next-common/styles/colors";

const Icon = styled.span`
  ${(p) => css`
    svg {
      path {
        fill: ${p.fill};
      }
  `}

  ${(p) => {
    const styles = [];

    if (p.onClick) {
      styles.push(`
        cursor: pointer;

        :hover {
          svg {
            path {
              fill: ${p.hoverFill};
            }
          }
        }
      `);
    }

    return css`
      ${styles.join("\n")}
    `;
  }}
`;

function createIcon(component) {
  return (props) => {
    const {
      fill = light_text_tertiary,
      hoverFill = light_text_secondary,
      ...rest
    } = props;
    return (
      <Icon fill={fill} hoverFill={hoverFill} {...rest}>
        {component}
      </Icon>
    );
  };
}

export const Trash = createIcon(<TrashIcon />);
