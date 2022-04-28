import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

import Layout from "components/layout";
import { withLoginUser, withLoginUserRedux } from "../lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  Title,
  LinkWrapper,
} from "components/login/styled";
import MailLogin from "components/login/mailLogin";

const AddressLogin = dynamic(() => import("components/login/addressLogin"), {
  ssr: false,
});

const Wrapper = styled.div`
  padding: 32px 0 6px;
  min-height: calc(100vh - 64px - 26px - 26px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const [web3, setWeb3] = useState(false);

  return (
    <Layout user={loginUser} chain={chain} isWeb3Login={web3}>
      <NextHead title={`Login`} desc={`Login`} />
      <Wrapper>
        <ContentCenterWrapper>
          <Title>Login</Title>
          {!web3 && <MailLogin setAddressLogin={() => setWeb3(true)} />}
          {web3 && <AddressLogin chain={chain} setMailLogin={() => setWeb3(false)} />}
          <LinkWrapper>
            Don’t have a account? <Link href="/signup">Sign up</Link>
          </LinkWrapper>
        </ContentCenterWrapper>
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
