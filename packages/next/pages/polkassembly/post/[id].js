import { getRedirectServerSideProps } from "next-common/services/serverSide";

export default function Post() {
  return "Please visit `/polkassembly/posts/[id]`";
}

export const getServerSideProps = getRedirectServerSideProps(
  (id) => `/polkassembly/posts/${id}`,
);
