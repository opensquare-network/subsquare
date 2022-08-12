import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { currentNodeSelector } from "../../store/reducers/nodeSlice";
import useApi from "../../utils/hooks/useApi";
import { useSubscribeChainHead, useBlockTime, useChainHeight } from "../../utils/hooks";
import { useIsMountedBool } from "../../utils/hooks/useIsMounted";
import dark from "../styled/theme/dark";
import light from "../styled/theme/light";
import { setBlockTime, setLatestHeight, setNowHeight } from "../../store/reducers/chainSlice";
import SEO from "../SEO";
import capitalize from "../../utils/capitalize";
import { DEFAULT_SEO_INFO } from "../../utils/constants";
import useWindowSize from "../../utils/hooks/useWindowSize";
import isNil from "lodash.isnil";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import Auth from "../auth";
import Header from "../header";
import Content from "./content";
import Toast from "../toast";
import { modeSelector } from "../../store/reducers/settingSlice";

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
`

export default function BaseLayout({ user, left, children, seoInfo }) {
  let chain = process.env.NEXT_PUBLIC_CHAIN;

  const endpoint = useSelector(currentNodeSelector);
  const api = useApi(chain, endpoint);
  const blockTime = useBlockTime(api);
  const latestHeight = useSubscribeChainHead(api);
  const nowHeight = useChainHeight(api);

  const dispatch = useDispatch();
  const isMounted = useIsMountedBool();
  const mode = useSelector(modeSelector);
  const theme = mode === "dark" ? dark : light;

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
  }, [nowHeight, dispatch])

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
    return <div>{seo}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        {seo}
        <GlobalStyle />
        <Auth chain={chain} />
        <Header user={user} left={left} chain={chain} />
        <Content left={left}>{children}</Content>
        <Toast />
      </Wrapper>
    </ThemeProvider>
  );
}
