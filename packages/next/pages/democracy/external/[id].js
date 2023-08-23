import { withLoginUser } from "next-common/lib";

export default function External() {
  return "Please visit `/democracy/externals/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/democracy/externals/${id}`,
    },
  };
});
