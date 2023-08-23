import { withLoginUser } from "next-common/lib";

export default function ChildBounty() {
  return "Please visit `/treasury/child-bounties/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/treasury/child-bounties/${id}`,
    },
  };
});
