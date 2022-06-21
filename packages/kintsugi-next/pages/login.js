import { withLoginUser } from "next-common/lib";
import Login from "next-common/components/pages/login";

export default Login;

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
