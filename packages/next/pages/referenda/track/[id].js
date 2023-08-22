import { withLoginUser } from "next-common/lib";

export default function Track() {
  return "Please visit `/referenda/tracks/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/referenda/tracks/${id}`,
    },
  };
});
