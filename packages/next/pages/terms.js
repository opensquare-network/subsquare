import { withLoginUser } from "next-common/lib";
import Terms from "next-common/components/pages/terms";

export default Terms;

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
