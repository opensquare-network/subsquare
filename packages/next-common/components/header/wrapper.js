import React, { memo } from "react";
import styled from "styled-components";
import { bg_theme } from "../../styles/tailwindcss";

const Wrapper = styled.header`
  padding-left: 32px;
  padding-right: 32px;
  @media screen and (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: ${(props) => props.theme.shadow100};
  height: 64px;
  border-bottom: 1px solid ${(props) => props.theme.grey200Border};
  ${bg_theme("neutral")};
  ${(p) => p.theme.isDark && bg_theme("neutralBg")};
`;

function HeaderWrapper({ children }) {
  let ChainWrapper = Wrapper;

  return <ChainWrapper>{children}</ChainWrapper>;
}

export default memo(HeaderWrapper);
