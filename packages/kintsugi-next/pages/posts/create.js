import { withLoginUser } from "next-common/lib";
import CreatePostPage from "@subsquare/next/pages/posts/create";

export default CreatePostPage;

export const getServerSideProps = withLoginUser(async () => {
  return {
    props: {},
  };
});
