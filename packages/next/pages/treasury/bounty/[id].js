import { withLoginUser } from "next-common/lib";

export default function Bounty() {
  return "Please visit `/treasury/bounties/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/treasury/bounties/${id}`,
    },
  };
});
