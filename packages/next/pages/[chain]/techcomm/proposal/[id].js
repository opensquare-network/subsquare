import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "../../../../utils/serverSideUtil";
import { TYPE_MOTION } from "../../../../utils/viewConstants";

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
        <Back href={`/${chain}/techcomm/proposals`} text="Back to Proposals" />
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
  const { chain, id } = context.query;

  const [{ result: motion }] = await Promise.all([
    nextApi.fetch(`${chain}/tech-comm/motions/${id}`),
  ]);

  if (!motion) {
    to404(context);
  }

  return {
    props: {
      motion: motion ?? null,
      chain,
    },
  };
});
