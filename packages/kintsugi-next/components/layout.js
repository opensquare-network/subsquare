import styled from "styled-components";

import Header from "./header";
import Content from "next-common/components/layout/content";
import SEO from "next-common/components/SEO";
import { DEFAULT_SEO_INFO } from "next-common/utils/constants";
import capitalize from "next-common/utils/capitalize";
import { useDispatch, useSelector } from "react-redux";
import { currentNodeSelector } from "next-common/store/reducers/nodeSlice";
import useApi from "next-common/utils/hooks/useApi";
import { useBestNumber, useBlockTime } from "next-common/utils/hooks";
import {
  setBlockTime,
  setFinalizedHeight,
} from "next-common/store/reducers/chainSlice";
import { useEffect } from "react";
import Auth from "next-common/components/auth";
import Toast from "next-common/components/toast";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  padding-top: 64px;
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

  useEffect(() => {
    if (blockTime) {
      dispatch(setBlockTime(blockTime.toNumber()));
    }
  }, [blockTime, dispatch]);

  useEffect(() => {
    if (bestNumber) {
      dispatch(setFinalizedHeight(bestNumber.toNumber()));
    }
  }, [bestNumber, dispatch]);

  return (
    <Wrapper>
      <SEO
        title={
          seoInfo?.title ||
          `SubSquare | ${capitalize(chain)} governance platform`
        }
        desc={seoInfo?.desc || DEFAULT_SEO_INFO.desc}
        chain={chain}
      />
      <Auth chain={chain} />
      <Header user={user} left={left} chain={chain} isWeb3Login={isWeb3Login} />
      <Content left={left}>{children}</Content>
      <Toast />
    </Wrapper>
  );
}
