import React from "react";
import styled from "styled-components";
import Link from "next/link";

import Layout from "next-common/components/layout";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import privacyMd from "./privacy-policy.md";
import Markdown from "next-common/components/micromarkMd";
import ArrowLeft from "../../icons/arrowLeft";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 852px;
`;

const BackButton = styled.div`
  margin-top: 8px;
  display: flex;
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  align-items: center;
  cursor: pointer;
  > svg {
    margin-right: 12px;
  }
`;

const Content = styled.div`
  margin-top: 16px;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  padding: 48px;
  p,
  h2,
  li {
    color: ${(props) => props.theme.textPrimary} !important;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 100%;
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

const Privacy = withLoginUserRedux(({ loginUser, chain }) => {
  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title="Privacy Policy" desc="Privacy Policy" />
      <Wrapper>
        <Link passHref={true} href="/signup">
          <a>
            <BackButton>
              <ArrowLeft />
              <div>Back</div>
            </BackButton>
          </a>
        </Link>
        <Content>
          <Title>Privacy Policy</Title>
          <Markdown md={privacyMd} />
        </Content>
      </Wrapper>
    </Layout>
  );
});

export default Privacy;
