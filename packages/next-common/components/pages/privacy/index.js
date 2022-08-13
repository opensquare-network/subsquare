import React from "react";
import styled from "styled-components";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import privacyMd from "./privacy-policy.md";
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
  color: ${(props) => props.theme.textPrimary};
  box-shadow: ${(props) => props.theme.shadow100};
  border-radius: 6px;
  padding: 48px;
  p,
  h2,
  h3,
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
    <BaseLayout user={loginUser} chain={chain}>
      <NextHead title="Privacy Policy" desc="Privacy Policy" />
      <Wrapper>
        <Back text="Back" href="signup" />
        <Content>
          <Title>Privacy Policy</Title>
          <Markdown md={privacyMd} />
        </Content>
      </Wrapper>
    </BaseLayout>
  );
});

export default Privacy;
