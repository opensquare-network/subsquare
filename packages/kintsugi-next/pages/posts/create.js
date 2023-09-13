import { withCommonProps } from "next-common/lib";
import CreatePostPage from "@subsquare/next/pages/posts/create";

export default CreatePostPage;

export const getServerSideProps = withCommonProps(async () => {
  return {
    props: {},
  };
});
