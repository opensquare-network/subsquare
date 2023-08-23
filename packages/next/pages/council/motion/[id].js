import { withLoginUser } from "next-common/lib";

export default function Motion() {
  return "Please visit `/council/motions/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/council/motions/${id}`,
    },
  };
});
