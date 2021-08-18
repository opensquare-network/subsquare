import styled from "styled-components";

import Layout from "components/layout";
import Back from "components/back";
import DetailItem from "components/detailItem";
import { detailData } from "utils/data";
import Timeline from "components/timeline";
import { timelineData } from "utils/data";
import Comment from "components/comment";
import { commentData } from "utils/data";
import Position from "components/position";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export default withLoginUserRedux(({ loginUser, detail }) => {
  return (
    <Layout user={loginUser} right={<Position />}>
      <Wrapper>
        <Back href="/" text="Back to Overview" />
        <DetailItem data={detail} />
        <Timeline data={timelineData} />
        <Comment data={commentData} />
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  const [{ result: detail }] = await Promise.all([
    nextApi.fetch(`posts/${id}`),
  ]);

  return {
    props: {
      detail,
    },
  };
});
