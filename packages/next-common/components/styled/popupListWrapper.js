import styled from "styled-components";
import { pretty_scroll_bar } from "../../styles/componentCss";
import { pageHomeLayoutMainContentWidth } from "../../utils/constants";

const PopupListWrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
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
`;

export default PopupListWrapper;
