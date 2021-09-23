import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import { ssrNextApi as nextApi } from "services/nextApi";
import LayoutFixedHeader from "components/layoutFixedHeader";
import MotionDetail from "components/motion/motionDetail";
import { to404 } from "../../../../utils/serverSideUtil";

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
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/council/motions`} text="Back to Motions" />
        <MotionDetail
          motion={motion}
          user={loginUser}
          chain={chain}
          type="motion"
        />
      </Wrapper>
    </LayoutFixedHeader>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const { chain, id } = context.query;

  const [{ result: motion }] = await Promise.all([
    nextApi.fetch(`${chain}/motions/${id}`),
  ]);

  !motion && to404(context);

  return {
    props: {
      motion: motion ?? null,
      chain,
    },
  };
});
