import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import { EmptyList } from "../../../utils/constants";
import LayoutFixedHeader from "../../../components/layoutFixedHeader";
import MotionDetail from "../../../components/motion/motionDetail";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-width: 848px;
  margin: auto;
`;


export default withLoginUserRedux(({loginUser, detail, comments, chain}) => {

  return (
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/motions`} text="Back to Motions"/>
        <MotionDetail
          data={{
            type: "Democracy",
            status: "Proposed",
            index: 18,
            ...detail
          }}
          user={loginUser}
          chain={chain}
          type="post"
        />
      </Wrapper>
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const {chain, id, page, page_size: pageSize} = context.query;

  const [{result: detail}] = await Promise.all([
    nextApi.fetch(`${chain}/posts/${id}`),
  ]);

  const postId = detail._id;

  const {result: comments} = await nextApi.fetch(
    `${chain}/posts/${postId}/comments`,
    {
      page: page ?? "last",
      pageSize: Math.min(pageSize ?? 50, 100),
    }
  );

  return {
    props: {
      detail,
      comments: comments ?? EmptyList,
      chain,
    },
  };
});
