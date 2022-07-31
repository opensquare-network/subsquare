import React, { useState } from "react";
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
import { p_14_normal } from "../../styles/componentCss";
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

const Hint = styled.p`
  padding: 12px 16px;
  ${p_14_normal};
  border-radius: 4px;
  color: ${(props) => props.theme.textSecondary};
  background: ${(props) => props.theme.grey100Bg};
  border-color: ${(props) => props.theme.grey300Border};
`;

const Login = withLoginUserRedux(({ loginUser, chain }) => {
  const [web3, setWeb3] = useState(true);
  return (
    <BaseLayout user={loginUser} chain={chain}>
      <NextHead title={`Login`} desc={`Login`} />
      <Wrapper>
        <ContentCenterWrapper>
          <PageTitleContainer>
            Login {web3 && ` with Web3 address`}
          </PageTitleContainer>
          {web3 && <Hint>Under the {chain} Network</Hint>}
          {!web3 && <MailLogin setAddressLogin={() => setWeb3(true)} />}
          {web3 && (
            <AddressLogin chain={chain} setMailLogin={() => setWeb3(false)} />
          )}
          {!web3 && (
            <LinkWrapper>
              Don’t have a account? <Link href="/signup">Sign up</Link>
            </LinkWrapper>
          )}
        </ContentCenterWrapper>
      </Wrapper>
    </BaseLayout>
  );
});

export default Login;
