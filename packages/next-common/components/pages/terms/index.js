import React from "react";
import styled from "styled-components";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import termsMd from "./terms-of-service.md";
import Markdown from "next-common/components/micromarkMd";
import BaseLayout from "../../layout/baseLayout";
import Back from "../../back";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 852px;
`;

const Content = styled.div`
  margin-top: 16px;
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey200Border};
  box-shadow: ${(props) => props.theme.shadow100};
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
    <BaseLayout user={loginUser} chain={chain}>
      <NextHead title="Terms of Service" desc="Terms of Service" />
      <Wrapper>
        <Back text="Back" href="signup" />
        <Content>
          <Title>Terms of Service</Title>
          <Markdown md={termsMd} />
        </Content>
      </Wrapper>
    </BaseLayout>
  );
});

export default Terms;
