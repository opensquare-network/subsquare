import styled from "styled-components";

import Back from "components/back";
import { withLoginUser, withLoginUserRedux } from "lib";
import nextApi from "services/nextApi";
import LayoutFixedHeader from "components/layoutFixedHeader";
import MotionDetail from "components/motion/motionDetail";

const Wrapper = styled.div`
  > :not(:first-child) {
    margin-top: 16px;
  }

  max-width: 848px;
  margin: auto;
`;

export default withLoginUserRedux(({ loginUser, motion, chain }) => {
  return (
    <LayoutFixedHeader user={loginUser} chain={chain}>
      <Wrapper className="post-content">
        <Back href={`/${chain}/motions`} text="Back to Motions" />
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
    nextApi.fetch(`${chain}/tech-comm/motions/${id}`),
  ]);

  return {
    props: {
      motion: motion ?? null,
      chain,
    },
  };
});
