import { withLoginUser } from "next-common/lib";

export default function Tip() {
  return "Please visit `/treasury/tips/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/treasury/tips/${id}`,
    },
  };
});
