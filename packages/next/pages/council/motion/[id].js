import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "utils/serverSideUtil";
import { TYPE_MOTION } from "utils/viewConstants";
import { isMotionCompleted } from "../../../utils/viewfuncs";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-width: 848px;
  margin: auto;
`;

export default withLoginUserRedux(({ loginUser, motion, chain }) => {
  motion.status = motion.state?.state;

  return (
    <Layout user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/council/motions`} text="Back to Motions" />
        <MotionDetail
          motion={motion}
          user={loginUser}
          chain={chain}
          type={TYPE_MOTION}
        />
      </Wrapper>
    </Layout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  const { id, page, page_size: pageSize } = context.query;

  const { result: motion } = await nextApi.fetch(`motions/${id}`);
  let external = null;

  if (isMotionCompleted(motion)) {
    const motionId = `${motion.state.indexer.blockHeight}_${motion.proposalHash}`;
    const res = await nextApi.fetch(`democracy/externals/${motionId}`);
    const { result: comments } = await nextApi.fetch(
      `democracy/externals/${res.result._id}/comments`,
      {
        page: page ?? "last",
        pageSize: Math.min(pageSize ?? 50, 100),
      }
    );
    external = { ...res.result, comments };
  }

  if (!motion) {
    to404(context);
  }

  return {
    props: {
      motion: motion ? { ...motion, external } : null,
      chain,
    },
  };
});
