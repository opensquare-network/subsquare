import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import useApi from "../../utils/hooks/useApi";
import {
  useBlockTime,
  useChainHeight,
  useSubscribeChainHead,
} from "../../utils/hooks";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import {
  setBlockTime,
  setLatestHeight,
  setNowHeight,
} from "../../store/reducers/chainSlice";
import SEO from "../SEO";
import capitalize from "../../utils/capitalize";
import { DEFAULT_SEO_INFO } from "../../utils/constants";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Header from "../header";
import Content from "./content";
import Toast from "../toast";
import useUpdateNodesDelay from "../../utils/hooks/useUpdateNodesDelay";
import { useChain } from "../../context/chain";
import { useThemeSetting } from "../../context/theme";
import CookiesConsent from "../../components/cookiesConsent";
import CMDKPalette from "../cmdk/cmdkPalette";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  padding-top: 64px;
  background: ${(props) => props.theme.grey100Bg};
`;

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => props.theme.grey100Bg};
  }
`;

export default function BaseLayout({ left, children, seoInfo }) {
  const chain = useChain();

  const api = useApi();
  const blockTime = useBlockTime(api);
  const latestHeight = useSubscribeChainHead(api);
  const nowHeight = useChainHeight(api);

  const dispatch = useDispatch();
  const isMounted = useIsMountedBool();
  const theme = useThemeSetting();

  useUpdateNodesDelay();

  useEffect(() => {
    if (blockTime && isMounted()) {
      dispatch(setBlockTime(blockTime.toNumber()));
    }
  }, [blockTime, dispatch, isMounted]);

  useEffect(() => {
    if (latestHeight && isMounted()) {
      dispatch(setLatestHeight(latestHeight));
    }
  }, [latestHeight, dispatch, isMounted]);

  useEffect(() => {
    dispatch(setNowHeight(nowHeight));
  }, [nowHeight, dispatch]);

  const seo = (
    <SEO
      {...seoInfo}
      title={
        seoInfo?.title || `SubSquare | ${capitalize(chain)} governance platform`
      }
      desc={seoInfo?.desc || DEFAULT_SEO_INFO.desc}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        {seo}
        <GlobalStyle />
        <Header left={left} />
        <Content left={left}>{children}</Content>
        <Toast />
      </Wrapper>

      <CookiesConsent />
      <CMDKPalette />
    </ThemeProvider>
  );
}
