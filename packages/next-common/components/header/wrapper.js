import React, { memo } from "react";
import styled, { css } from "styled-components";
import { shadow_100 } from "@subsquare/next/styles/componentCss";
import useWindowSize from "../../utils/hooks/useWindowSize";
import getChainSettings from "../../utils/consts/settings";
import useDarkMode from "../../utils/hooks/useDarkMode";

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
  z-index: 1;
  background: ${(props) => props?.background || "#ffffff;"};
  ${shadow_100};
  height: 64px;
  border-bottom: 1px solid #ebeef4;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #272a3a;
    `};
`;

function HeaderWrapper({ chain, children }) {
  let ChainWrapper = Wrapper;

  const { width } = useWindowSize();
  if (parseInt(width) <= 768) {
    return <ChainWrapper>{children}</ChainWrapper>;
  }
  const [theme] = useDarkMode();

  const setting = getChainSettings(chain);
  return (
    <ChainWrapper theme={theme} background={setting.headerBackgroundColor}>
      {children}
    </ChainWrapper>
  );
}

export default memo(HeaderWrapper);
