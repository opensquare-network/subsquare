import React from "react";
import styled from "styled-components";
import { pageHomeLayoutMainContentWidth } from "next-common/utils/constants";

export const ListWrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }

  > :not(:first-child) {
    margin-top: 16px;
  }
`;
