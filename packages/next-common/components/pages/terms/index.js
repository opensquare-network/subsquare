import React from "react";
import styled from "styled-components";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import termsMd from "./terms-of-service.md";
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
  box-shadow: var(--shadow100);
  border-radius: 6px;
  padding: 48px;
  color: var(--textPrimary);

  p,
  h2,
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

const Terms = withLoginUserRedux(() => {
  return (
    <BaseLayout>
      <NextHead title="Terms of Service" desc="Terms of Service" />
      <Wrapper>
        <Back text="Back" href="signup" />
        <Content>
          <Title>Terms of Service</Title>
          <MarkdownPreviewer content={termsMd} />
        </Content>
      </Wrapper>
    </BaseLayout>
  );
});

export default Terms;
