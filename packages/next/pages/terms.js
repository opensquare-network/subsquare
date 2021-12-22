import styled from "styled-components";
import Link from "next/link";

import Layout from "components/layout";
import { withLoginUser, withLoginUserRedux } from "../lib";
import NextHead from "components/nextHead";
import termsMd from "public/terms-of-service.md";
import Markdown from "components/micromarkMd";

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 848px;
`;

const BackButton = styled.div`
  display: inline-block;
  margin-top: 8px;
  display: flex;
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  align-items: center;
  cursor: pointer;
  > img {
    width: 14px;
    height: 14px;
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

  * {
    color: #506176 !important;
    line-height: 140% !important;
    h1,
    h2,
    p,
    li {
      margin: 8px 0 !important;
    }
    h1,
    h2 {
      color: #1e2134 !important;
    }
    h2 {
      font-size: 19px !important;
    }
    a {
      color: #1f70c7 !important;
    }
  }
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title="Terms of Service" desc="Terms of Service" />
      <Wrapper>
        <Link href="/signup">
          <BackButton>
            <img src="/imgs/icons/arrow-left.svg" />
            <div>Back</div>
          </BackButton>
        </Link>
        <Content>
          <Markdown md={termsMd} />
        </Content>
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
