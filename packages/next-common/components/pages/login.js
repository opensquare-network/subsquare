import React, { Fragment, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import dynamic from "next/dynamic";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import {
  ContentCenterWrapper,
  LinkWrapper,
} from "next-common/components/login/styled";
import MailLogin from "next-common/components/login/mailLogin";
import { PageTitleContainer } from "../styled/containers/titleContainer";
import BaseLayout from "../layout/baseLayout";

const AddressLogin = dynamic(() => import("../login/addressLogin"), {
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

const Login = withLoginUserRedux(({ loginUser, chain }) => {
  const [web3, setWeb3] = useState(true);
  return (
    <BaseLayout user={loginUser} chain={chain}>
      <NextHead title={`Login`} desc={`Login`} />
      <Wrapper>
        <ContentCenterWrapper>
          <PageTitleContainer>Login</PageTitleContainer>

          {!web3 && (
            <Fragment>
              <MailLogin setAddressLogin={() => setWeb3(true)} />
              <LinkWrapper>
                Don’t have a account? <Link href="/signup">Sign up</Link>
              </LinkWrapper>
            </Fragment>
          )}
          {web3 && (
            <AddressLogin chain={chain} setMailLogin={() => setWeb3(false)} />
          )}
        </ContentCenterWrapper>
      </Wrapper>
    </BaseLayout>
  );
});

export default Login;
