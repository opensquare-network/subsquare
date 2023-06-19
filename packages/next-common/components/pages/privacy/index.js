import React from "react";
import styled from "styled-components";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import privacyMd from "./privacy-policy.md";
import BaseLayout from "../../layout/baseLayout";
import Back from "../../back";
import { MarkdownPreviewer } from "@osn/previewer";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 852px;
`;

const Content = styled.div`
  margin-top: 16px;
  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  color: var(--textPrimary);
  box-shadow: var(--shadow100);
  border-radius: 6px;
  padding: 48px;
  p,
  h2,
  h3,
  li {
    color: var(--textPrimary) !important;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 100%;
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

const Privacy = withLoginUserRedux(() => {
  return (
    <BaseLayout>
      <NextHead title="Privacy Policy" desc="Privacy Policy" />
      <Wrapper>
        <Back text="Back" href="signup" />
        <Content>
          <Title>Privacy Policy</Title>
          <MarkdownPreviewer content={privacyMd} />
        </Content>
      </Wrapper>
    </BaseLayout>
  );
});

export default Privacy;
