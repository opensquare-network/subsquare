import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link";

import Layout from "next-common/components/layout";
import { withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import privacyMd from "./privacy-policy.md";
import Markdown from "next-common/components/micromarkMd";
import ArrowLeft from "../../icons/arrowLeft";
import useDarkMode from "../../../utils/hooks/useDarkMode";

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
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 6px;
  padding: 48px;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      color: white;
      p,
      h2,
      li {
        color: white !important;
      }
    `}
`;

const Title = styled.h1`
  font-size: 1.5rem;
  line-height: 100%;
  font-weight: bold;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

const Privacy = withLoginUserRedux(({ loginUser, chain }) => {
  const [theme] = useDarkMode();
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
        <Content theme={theme}>
          <Title>Privacy Policy</Title>
          <Markdown md={privacyMd} />
        </Content>
      </Wrapper>
    </Layout>
  );
});

export default Privacy;
