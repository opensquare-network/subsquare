import { withLoginUser } from "next-common/lib";

export default function Announcement() {
  return "Please visit `/alliance/announcements/[id]`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  const { id } = context.query;

  return {
    redirect: {
      permanent: true,
      destination: `/alliance/announcements/${id}`,
    },
  };
});
