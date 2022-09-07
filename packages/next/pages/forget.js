import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Forget from "next-common/components/pages/forget";

export default withLoginUserRedux(Forget);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
