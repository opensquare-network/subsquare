import { withLoginUser } from "next-common/lib";

export default function Proposal() {
  return "Please visit `/treasury/proposals/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/treasury/proposals/${id}`,
    },
  };
});
