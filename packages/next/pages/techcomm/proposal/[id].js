import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import TechcommMotionDetail from "components/motion/techcommMotionDetail";
import { to404 } from "utils/serverSideUtil";
import { TYPE_MOTION } from "utils/viewConstants";
import { getMetaDesc } from "../../../utils/viewfuncs";
import NextHead from "../../../components/nextHead";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-width: 848px;
  margin: auto;
`;

export default withLoginUserRedux(({ loginUser, motion, chain }) => {
  motion.status = motion.state?.state;

  const desc = getMetaDesc(motion, "Proposal");
  return (
    <Layout user={loginUser} chain={chain}>
      <NextHead
        title={`${motion.title ?? "Subsquare"}`}
        desc={desc}
        type={"post"}
      />
      <Wrapper className="post-content">
        <Back href={`/techcomm/proposals`} text="Back to Proposals" />
        <TechcommMotionDetail
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

  const { id } = context.query;

  const [{ result: motion }] = await Promise.all([
    nextApi.fetch(`tech-comm/motions/${id}`),
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
