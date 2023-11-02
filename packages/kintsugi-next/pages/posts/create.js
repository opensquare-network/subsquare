import CreatePostPage from "@subsquare/next/pages/posts/create";
import { serverSidePropsWithSummary } from "next-common/services/serverSide/serverSidePropsWithSummary";

export default CreatePostPage;

export const getServerSideProps = serverSidePropsWithSummary;
