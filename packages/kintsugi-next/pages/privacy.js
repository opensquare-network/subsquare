import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import Privacy from "next-common/components/pages/privacy";

export default withLoginUserRedux(Privacy);

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
