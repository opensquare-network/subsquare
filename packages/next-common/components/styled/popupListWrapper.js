import { breakpoint } from "next-common/utils/responsive";
import styled, { css } from "styled-components";
import tw from "tailwind-styled-components";

const Comp = tw.div`
  [&_table_tbody]:scrollbar-pretty
`;

const PopupListWrapper = styled(Comp)`
  width: 100%;
  ${breakpoint(
    720,
    css`
      overflow-x: scroll;
    `,
  )};

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
