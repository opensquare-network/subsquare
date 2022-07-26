import React from "react";
import styled from "styled-components";
import Link from "next/link";

import Layout from "next-common/components/layout";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import termsMd from "./terms-of-service.md";
import Markdown from "next-common/components/micromarkMd";
import ArrowLeft from "../../icons/arrowLeft";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 852px;
`;

const BackButton = styled.div`
  display: flex;
  margin-top: 8px;
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
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  color: ${(props) => props.theme.textPrimary};

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

const Terms = withLoginUserRedux(({ loginUser, chain }) => {
  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title="Terms of Service" desc="Terms of Service" />
      <Wrapper>
        <Link href="/signup" passHref>
          <BackButton>
            <ArrowLeft />
            <div>Back</div>
          </BackButton>
        </Link>
        <Content>
          <Title>Terms of Service</Title>
          <Markdown md={termsMd} />
        </Content>
      </Wrapper>
    </Layout>
  );
});

export default Terms;
