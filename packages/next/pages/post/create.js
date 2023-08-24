import { withLoginUser } from "next-common/lib";

export default function Create() {
  return "Please visit `/posts/create`";
}

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    redirect: {
      permanent: true,
      destination: "/posts/create",
    },
  };
});
