import styled from "styled-components";
import Layout from "next-common/components/layout";
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import PostCreate from "next-common/components/post/postCreate";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 848px;
  margin: auto;
`;

export default withLoginUserRedux(({ loginUser, chain }) => {
  const router = useRouter();

  useEffect(() => {
    if (loginUser === null) {
      router.push({
        pathname: "/login",
        query: {
          redirect: router.route,
        },
      });
    }
  }, [loginUser, router]);

  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead title={`Create post`} desc={``} />
      <Wrapper>
        <Back href={`/discussions`} text="Back to Discussions" />
        <PostCreate chain={chain} loginUser={loginUser} />
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
