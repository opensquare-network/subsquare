import { withLoginUser } from "next-common/lib";
import EmailPage from "next-common/components/emailPage/email";

export default EmailPage;

export const getServerSideProps = withLoginUser(async (context) => {
  const chain = process.env.CHAIN;

  return {
    props: {
      chain,
    },
  };
});
