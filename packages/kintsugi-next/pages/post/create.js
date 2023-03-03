import styled from "styled-components";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import NextHead from "next-common/components/nextHead";
import PostCreate from "next-common/components/post/postCreate";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BaseLayout from "next-common/components/layout/baseLayout";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import Breadcrumb from "next-common/components/_Breadcrumb";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
  max-width: 852px;
  margin: auto;
`;

export default withLoginUserRedux(({ loginUser }) => {
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

  const breadcrumbItems = [
    {
      content: "Discussions",
      path: "/discussions",
    },
    {
      content: "New Post",
    },
  ];

  return (
    <BaseLayout>
      <NextHead title={"Create post"} desc={""} />
      <Wrapper>
        <BreadcrumbWrapper>
          <Breadcrumb items={breadcrumbItems} />
        </BreadcrumbWrapper>

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
