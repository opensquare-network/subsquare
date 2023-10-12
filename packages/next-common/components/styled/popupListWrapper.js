import { breakpoint } from "next-common/utils/responsive";
import styled, { css } from "styled-components";
import tw from "tailwind-styled-components";

const TwDiv = tw.div`
  space-y-4 m-auto
  max-md:max-w-[960px]
  [&_table_tbody]:scrollbar-pretty
`;

const PopupListWrapper = styled(TwDiv)`
  width: 100%;
  ${breakpoint(
    720,
    css`
      overflow-x: scroll;
    `,
  )};
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
