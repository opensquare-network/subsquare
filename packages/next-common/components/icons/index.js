import React from "react";
import styled, { css } from "styled-components";
import TrashIcon from "next-common/assets/imgs/icons/delete.svg";
import CaretDownIcon from "next-common/assets/imgs/icons/caret-down.svg";
import CloseIcon from "next-common/assets/imgs/icons/close.svg";
import {
  light_text_tertiary,
  light_text_secondary,
} from "next-common/styles/colors";
import ApproveIcon from "../../assets/imgs/icons/approve.svg";
import RejectSvg from "../../assets/imgs/icons/reject.svg";

const Icon = styled.span`
  display: inline-flex;

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

function createIcon(component, optionsProps) {
  return (props) => {
    const {
      fill = light_text_tertiary,
      hoverFill = light_text_secondary,
      ...rest
    } = props;

    return (
      <Icon fill={fill} hoverFill={hoverFill} {...rest} {...optionsProps}>
        {component}
      </Icon>
    );
  };
}

const noFill = {
  fill: "",
  hoverFill: "",
};
export const Trash = createIcon(<TrashIcon />);
export const CaretDown = createIcon(<CaretDownIcon />, noFill);
export const Close = createIcon(<CloseIcon />);
export const Approve = createIcon(<ApproveIcon />, noFill);
export const Reject = createIcon(<RejectSvg />, noFill);
