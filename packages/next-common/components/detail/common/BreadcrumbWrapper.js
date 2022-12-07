import styled, { css } from "styled-components";
import { smcss } from "../../../utils/responsive";

const BreadcrumbWrapper = styled.div`
  ${smcss(css`
    padding: 0 16px;
  `)}
`;

export const BreadcrumbHideOnMobileText = styled.span`
  ${smcss(css`
    display: none;
  `)}
`;

export default BreadcrumbWrapper;
