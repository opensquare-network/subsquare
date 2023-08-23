import { withLoginUser } from "next-common/lib";

export default function Referendum() {
  return "Please visit `/democracy/referenda/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/democracy/referenda/${id}`,
    },
  };
});
