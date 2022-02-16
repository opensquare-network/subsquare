import styled from "styled-components";

import Header from "./header";
import Content from "next-common/components/layout/content";
import Toast from "./toast";
import Auth from "./auth";
import SEO from "next-common/components/SEO";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  padding-top: 64px;
`;

export default function Layout({ user, left, children, chain, isWeb3Login, seoInfo }) {
  return (
    <Wrapper>
      {seoInfo && <SEO
        title={seoInfo.title || `SubSquare`}
        desc={seoInfo.desc || `SubSquare`}
        chain={chain}
      />}
      <Auth chain={chain} />
      <Header user={user} left={left} chain={chain} isWeb3Login={isWeb3Login} />
      <Content left={left}>{children}</Content>
      <Toast />
    </Wrapper>
  );
}
