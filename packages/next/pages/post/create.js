import styled from "styled-components";
import Back from "next-common/components/back";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import PostCreate from "next-common/components/post/postCreate";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BaseLayout from "next-common/components/layout/baseLayout";
import { useIsLogin } from "next-common/context/user";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 852px;
  margin: auto;
`;

export default withLoginUserRedux(() => {
  const router = useRouter();
  const isLogin = useIsLogin();

  useEffect(() => {
    if (!isLogin) {
      router.push({
        pathname: "/login",
        query: {
          redirect: router.route,
        },
      });
    }
  }, [isLogin, router]);

  return (
    <BaseLayout>
      <NextHead title={`Create post`} desc={``} />
      <Wrapper>
        <Back href={`/discussions`} text="Back to Discussions" />
        <PostCreate />
      </Wrapper>
    </BaseLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
