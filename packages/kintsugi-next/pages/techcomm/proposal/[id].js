import { withLoginUser } from "next-common/lib";

export default function TechCommProposal() {
  return "Please visit `/techcomm/proposals/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/techcomm/proposals/${id}`,
    },
  };
});
