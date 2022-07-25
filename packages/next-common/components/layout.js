import React, { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";

import Header from "next-common/components/header";
import Content from "next-common/components/layout/content";
import SEO from "next-common/components/SEO";
import capitalize from "next-common/utils/capitalize";
import { DEFAULT_SEO_INFO } from "next-common/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import useApi from "next-common/utils/hooks/useApi";
import { useBestNumber, useBlockTime } from "next-common/utils/hooks";
import {
  setBlockTime,
  setFinalizedHeight,
} from "next-common/store/reducers/chainSlice";
import Auth from "next-common/components/auth";
import Toast from "next-common/components/toast";
import { useIsMountedBool } from "next-common/utils/hooks/useIsMounted";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import isNil from "lodash.isnil";
import useDarkMode from "../utils/hooks/useDarkMode";
import dark from "./styled/theme/dark";
import light from "./styled/theme/light";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  padding-top: 64px;
  background: ${(props) => props.theme.bg};
`;

export default function Layout({
  user,
  left,
  children,
  chain,
  isWeb3Login,
  seoInfo,
}) {
  const endpoint = useSelector(currentNodeSelector);
  const api = useApi(chain, endpoint);
  const blockTime = useBlockTime(api);
  const bestNumber = useBestNumber(api);
  const dispatch = useDispatch();
  const isMounted = useIsMountedBool();
  const [mode] = useDarkMode();
  const theme = mode === "dark" ? dark : light;

  useEffect(() => {
    if (blockTime && isMounted()) {
      dispatch(setBlockTime(blockTime.toNumber()));
    }
  }, [blockTime, dispatch, isMounted]);

  useEffect(() => {
    if (bestNumber && isMounted()) {
      dispatch(setFinalizedHeight(bestNumber.toNumber()));
    }
  }, [bestNumber, dispatch, isMounted]);

  const seo = (
    <SEO
      {...seoInfo}
      title={
        seoInfo?.title || `SubSquare | ${capitalize(chain)} governance platform`
      }
      desc={seoInfo?.desc || DEFAULT_SEO_INFO.desc}
      chain={chain}
    />
  );

  const { width } = useWindowSize();
  if (isNil(width)) {
    return <Wrapper>{seo}</Wrapper>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        {seo}
        <Auth chain={chain} />
        <Header
          user={user}
          left={left}
          chain={chain}
          isWeb3Login={isWeb3Login}
        />
        <Content left={left}>{children}</Content>
        <Toast />
      </Wrapper>
    </ThemeProvider>
  );
}
