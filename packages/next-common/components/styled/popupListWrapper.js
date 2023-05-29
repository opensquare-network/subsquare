import { overflow_x_scroll, w_full } from "next-common/styles/tailwindcss";
import { breakpoint } from "next-common/utils/responsive";
import styled from "styled-components";
import { pretty_scroll_bar } from "../../styles/componentCss";
import { pageHomeLayoutMainContentWidth } from "../../utils/constants";

const PopupListWrapper = styled.div`
  ${w_full};
  max-width: ${pageHomeLayoutMainContentWidth}px;
  ${breakpoint(720, overflow_x_scroll)};

  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;
  > div :not(:first-child) {
    margin-top: 16px;
  }
  table {
    border: none;
    padding: 0;
    tbody {
      display: block;
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;
      ${pretty_scroll_bar};
    }
    thead,
    tbody tr {
      display: table;
      width: 100%;
    }
    box-shadow: none;
  }

  /* reset */
  table,
  thead,
  tbody,
  tfoot,
  tr,
  th,
  td {
    border-collapse: inherit;
    border-spacing: 0;
  }
`;

export default PopupListWrapper;
