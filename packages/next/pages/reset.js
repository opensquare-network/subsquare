import { withLoginUser } from "next-common/lib";
import Reset from "next-common/components/pages/reset";

export default Reset;

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
