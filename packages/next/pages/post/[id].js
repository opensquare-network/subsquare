import { withLoginUser } from "next-common/lib";

export default function Post() {
  return "Please visit `/posts/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/posts/${id}`,
    },
  };
});
