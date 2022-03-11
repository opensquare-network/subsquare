import styled from "styled-components";

import Header from "./header";
import Content from "next-common/components/layout/content";
import Toast from "components/toast";
import Auth from "components/auth";
import SEO from "next-common/components/SEO";
import capitalize from "next-common/utils/capitalize";
import { DEFAULT_SEO_INFO } from "next-common/utils/constants";

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
