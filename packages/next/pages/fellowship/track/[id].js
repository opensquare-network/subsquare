import { withLoginUser } from "next-common/lib";

export default function Track() {
  return "Please visit `/fellowship/tracks/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/fellowship/tracks/${id}`,
    },
  };
});
