import styled from "styled-components";

import Layout from "components/layout";
import Back from "components/back";
import DetailItem from "components/detailItem";
import Comments from "components/comment";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export default withLoginUserRedux(({ loginUser, detail, comments, chain }) => {
  const postId = detail._id;

  return (
    <Layout user={loginUser} right={<div />}>
      <Wrapper>
        <Back href="/" text="Back to Overview" />
        <DetailItem data={detail} />
        {/* <Timeline data={timelineData} /> */}
        <Comments data={comments} user={loginUser} postId={postId} chain={chain} />
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain, id, page } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  const postId = detail._id;

  const { result: comments } = await nextApi.fetch(`posts/${postId}/comments`, {
    page: page ?? "last",
  });

  return {
    props: {
      detail,
      comments,
      chain,
    },
  };
});
