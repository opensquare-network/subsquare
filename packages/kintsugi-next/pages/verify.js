import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Verify from "next-common/components/pages/verify";

export default withLoginUserRedux(Verify);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
